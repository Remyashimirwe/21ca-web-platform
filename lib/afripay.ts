import crypto from "crypto";
export const afripayAppId = process.env.AFRIPAY_APP_ID || "";
export const afripayAppSecret = process.env.AFRIPAY_APP_SECRET || "";

export const AFRIPAY_CHECKOUT_URL = "https://www.afripay.africa/checkout/index.php";

export type AfripayCurrency = "RWF" | "USD";
const SUPPORTED_CURRENCIES: AfripayCurrency[] = ["RWF", "USD"];


const currencyMap: Record<string, AfripayCurrency> = {
    RW: 'RWF',
    NG: 'NGN' as any,
    GH: 'USD' as any,
    KE: 'USD' as any,
    UG: 'USD' as any,
    TZ: 'USD' as any,
    ZA: 'USD' as any,
    US: 'USD',
    GB: 'USD' as any,
    CA: 'USD' as any,
    EU: 'USD' as any,
};

/**
 * Get currency by country code
 * Returns USD as default for unsupported countries
 * 
 * @param countryCode - ISO country code (e.g., "RW", "US")
 * @returns 
 */
export function getCurrencyByCountry(countryCode?: string): AfripayCurrency {
    if (!countryCode) return 'USD';
    const currency = currencyMap[countryCode.toUpperCase()];
    return (isValidCurrency(currency) ? currency : 'USD') as AfripayCurrency;
}

// Supported payment methods
export type AfripayPaymentMethod = "mtn" | "airtel" | "visa" | "mastercard";

// Payment status values
export type AfripayPaymentStatus = "success" | "successful" | "failed" | "failure" | "pending";

/**
 * Generate a unique reference ID for every transaction
 * This ID serves as the client_token sent to Afripay, linking their transaction to your database record.
 * 
 * @param userId - User ID to include in the reference
 * @returns Unique reference ID in format ORD-{USER_ID}-{HASH}
 */
export function generateRefId(userId: string): string {
  const ts = Date.now();
  const hash = crypto
    .createHash("sha256")
    .update(`${userId}-${ts}`)
    .digest("hex")
    .slice(0, 8);
  return `ORD-${userId.slice(-6).toUpperCase()}-${hash.toUpperCase()}`;
}

/**
 * Validate currency is supported by Afripay
 * 
 * @param currency - Currency code to validate
 * @returns Boolean indicating if currency is supported
 */
export function isValidCurrency(currency: string): currency is AfripayCurrency {
  return SUPPORTED_CURRENCIES.includes(currency as AfripayCurrency);
}

/**
 * Validate minimum transaction amount
 * Minimum amount is 500 RWF for RWF transactions
 * 
 * @param amount - Amount to validate
 * @param currency - Currency code
 * @returns Boolean indicating if amount meets minimum
 */
export function isValidAmount(amount: number, currency: AfripayCurrency = "RWF"): boolean {
  if (currency === "RWF") {
    return amount >= 500; // 500 RWF minimum
  }
  // For USD, apply reasonable minimum (e.g., 0.50)
  return amount >= 0.5;
}

/**
 * Format amount for Afripay
 * Amounts should be sent as strings to avoid precision issues
 * 
 * @param amount - Numeric amount
 * @returns String representation of amount
 */
export function formatAmount(amount: number): string {
  return String(Math.round(amount));
}

/**
 * Normalize payment status from webhook
 * Afripay might send "success" or "successful", and "failed" or "failure"
 * 
 * @param status - Raw status from Afripay webhook
 * @returns Normalized status: "success" or "failed"
 */
export function normalizePaymentStatus(status: string): "success" | "failed" {
  const normalized = status.toLowerCase();
  if (normalized === "success" || normalized === "successful") {
    return "success";
  }
  return "failed";
}

/**
 * Build the checkout payload for Afripay
 * This should be called on your backend /api/payment/initiate endpoint
 * 
 * @param params - Payment initialization parameters
 * @returns Form data object to send to Afripay
 */
export interface CheckoutPayload {
  amount: string;
  currency: AfripayCurrency;
  comment: string;
  client_token: string;
  return_url: string;
  app_id: string;
  app_secret: string;
}

export interface CheckoutParams {
  userId: string;
  amount: number;
  currency?: AfripayCurrency;
  description?: string;
  returnUrl: string;
}

export function buildCheckoutPayload(params: CheckoutParams): CheckoutPayload {
  const { userId, amount, currency = "RWF", description = "", returnUrl } = params;

  if (!isValidCurrency(currency)) {
    throw new Error(`Invalid currency: ${currency}. Supported: ${SUPPORTED_CURRENCIES.join(", ")}`);
  }

  if (!isValidAmount(amount, currency)) {
    throw new Error(`Invalid amount: ${amount} ${currency}. Minimum: 500 RWF or 0.50 USD`);
  }

  if (!afripayAppId || !afripayAppSecret) {
    throw new Error("Afripay credentials not configured. Set AFRIPAY_APP_ID and AFRIPAY_APP_SECRET.");
  }

  const refId = generateRefId(userId);
  const formattedAmount = formatAmount(amount);
  const comment = description || `Payment for Order ${refId}`;

  return {
    amount: formattedAmount,
    currency,
    comment,
    client_token: refId,
    return_url: returnUrl,
    app_id: afripayAppId,
    app_secret: afripayAppSecret,
  };
}

/**
 * Generate the complete response for frontend checkout
 * 
 * @param checkoutPayload - Payload from buildCheckoutPayload
 * @returns Response object to send to frontend
 */
export interface CheckoutResponse {
  ok: boolean;
  checkoutUrl: string;
  formData: CheckoutPayload;
}

export function buildCheckoutResponse(checkoutPayload: CheckoutPayload): CheckoutResponse {
  return {
    ok: true,
    checkoutUrl: AFRIPAY_CHECKOUT_URL,
    formData: checkoutPayload,
  };
}

/**
 * Webhook payload structure received from Afripay
 * This is sent via POST to your configured webhook endpoint
 */
export interface AfripayWebhookPayload {
  status: AfripayPaymentStatus;
  amount: string;
  currency: AfripayCurrency;
  transaction_ref: string;
  payment_method: AfripayPaymentMethod;
  client_token: string;
}

/**
 * Validate webhook payload from Afripay
 * Ensures all required fields are present
 * 
 * @param payload - Raw webhook payload
 * @returns Boolean indicating if payload is valid
 */
export function isValidWebhookPayload(payload: unknown): payload is AfripayWebhookPayload {
  if (!payload || typeof payload !== "object") return false;

  const p = payload as Record<string, unknown>;
  return (
    typeof p.status === "string" &&
    typeof p.amount === "string" &&
    typeof p.currency === "string" &&
    typeof p.transaction_ref === "string" &&
    typeof p.payment_method === "string" &&
    typeof p.client_token === "string"
  );
}

/**
 * Extract payload safely from request (handles JSON and form-data)
 * 
 * @param body - Request body as object
 * @returns Parsed webhook payload
 */
export function extractPayloadFromRequest(body: unknown): AfripayWebhookPayload {
  if (!isValidWebhookPayload(body)) {
    throw new Error("Invalid webhook payload structure");
  }
  return body;
}

/**
 * Verify Afripay webhook HMAC signature.
 *
 * Afripay (and most PSPs) sign the *raw* request body with the merchant
 * `app_secret` using HMAC-SHA256 and send the hex digest in a header
 * (commonly `x-afripay-signature`). We accept a few common header names
 * so we don't have to hard-fail if Afripay tweaks the casing.
 *
 * The comparison is timing-safe.
 *
 * @param rawBody - Exact raw request body string (must NOT be re-stringified)
 * @param signatureHeader - Value of the signature header from the request
 * @param secret - Shared secret (AFRIPAY_APP_SECRET)
 * @returns true iff the signature matches
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  secret: string
): boolean {
  if (!signatureHeader || !secret) return false;

  // Some providers prefix the digest with "sha256=".
  const provided = signatureHeader.trim().replace(/^sha256=/i, "");

  let expected: string;
  try {
    expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("hex");
  } catch {
    return false;
  }

  // Lengths must match for timingSafeEqual.
  if (provided.length !== expected.length) return false;

  try {
    return crypto.timingSafeEqual(
      Buffer.from(provided, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

/**
 * Process webhook and return normalized data for database update
 * 
 * @param payload - Afripay webhook payload
 * @returns Normalized payment update data
 */
export interface PaymentUpdateData {
  status: "success" | "failed";
  providerRef: string;
  method: AfripayPaymentMethod;
}

export function processWebhookPayload(payload: AfripayWebhookPayload): PaymentUpdateData {
  return {
    status: normalizePaymentStatus(payload.status),
    providerRef: payload.transaction_ref,
    method: payload.payment_method,
  };
}

/**
 * Validate callback URL is publicly accessible (basic check)
 * This URL will be configured with Afripay support
 * 
 * @param url - Callback URL to validate
 * @returns Boolean indicating if URL appears valid
 */
export function isValidCallbackUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Must be HTTPS for production
    if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Build payment status check response for frontend polling
 * Used when user returns from Afripay to check if payment is confirmed
 * 
 * @param dbPaymentStatus - Current payment status from database
 * @returns Frontend-ready status response
 */
export interface PaymentStatusResponse {
  status: "pending" | "success" | "failed";
  refId: string;
  message?: string;
}

export function buildStatusResponse(
  refId: string,
  dbPaymentStatus: string
): PaymentStatusResponse {
  let status: "pending" | "success" | "failed" = "pending";
  
  if (dbPaymentStatus === "success" || dbPaymentStatus === "successful") {
    status = "success";
  } else if (dbPaymentStatus === "failed" || dbPaymentStatus === "failure") {
    status = "failed";
  }

  return {
    status,
    refId,
  };
}
