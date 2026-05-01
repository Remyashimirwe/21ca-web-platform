export const flutterwavePublicKey = process.env.FLW_PUBLIC_KEY || '';
export const flutterwaveSecretKey = process.env.FLW_SECRET_KEY || '';
export const flutterwaveEncryptionKey = process.env.FLW_ENCRYPTION_KEY || '';

const currencyMap: Record<string, string> = {
    RW: 'RWF',
    NG: 'NGN',
    GH: 'GHS',
    KE: 'KES',
    UG: 'UGX',
    TZ: 'TZS',
    ZA: 'ZAR',
    US: 'USD',
    GB: 'GBP',
    CA: 'CAD',
    EU: 'EUR',
};

export function getCurrencyByCountry(countryCode?: string) {
    if (!countryCode) return 'USD';
    return currencyMap[countryCode.toUpperCase()] || 'USD';
}

export function formatAmount(amount: number) {
    return Number(amount.toFixed(2));
}