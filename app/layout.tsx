import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import React from "react";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { PushNotificationManager } from "@/components/notifications/PushNotificationManager";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
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

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <ConditionalNavbar />
                <main>
                    {children}
                </main>
                <Toaster />
                <PushNotificationManager />
            </ThemeProvider>
            </body>
            </html>
        </ClerkProvider>
    );
}