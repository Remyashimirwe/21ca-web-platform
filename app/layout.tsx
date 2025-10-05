import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { ThemeProvider } from "@/components/theme-provider"
import {ClerkProvider} from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "21st Century Academy",
    description: "Empowering learning with a modern LMS.",
    manifest: "/manifest.json",
    icons: {
        icon: [
            { url: "/21CA_logo.png", sizes: "16x16" },
            { url: "/21CA_logo.png", sizes: "32x32" },
            { url: "/21CA_logo.png", sizes: "48x48" },
        ],
        apple: { url: "/21CA_logo.png", sizes: "180x180" },
    },
};

// Add viewport configuration to prevent mobile zoom
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider>
          <html lang="en" suppressHydrationWarning>
          <head>
              {/* Fallback viewport meta tag for older browsers */}
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          </head>
          <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
          >
              <ConditionalNavbar />
              {children}
          </ThemeProvider>
          </body>
          </html>
      </ClerkProvider>
  );
}