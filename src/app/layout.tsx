import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "./providers/query-provider";
import { AuthProvider } from "./auth/context/auth-context";
import { Toaster } from "sonner";
import { Suspense } from "react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/logo_color_client.png",
    shortcut: "/logo_color_client.png",
    apple: "/logo_color_client.png",
  },
  title: "Click&Agenda",
  description: "Sitema de Agendamentos facil e rapido",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
            <QueryProvider>
              <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                {children}
              </Suspense>
            </ QueryProvider>
          <Toaster position="top-right" richColors />
        </AuthProvider>
          
      </body>
    </html>
  );
}
