import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import SwrConfig from "@/components/swr-config";
import { Slide, ToastContainer } from 'react-toastify';
import { hideGlobalToast } from "@/constants/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHEMS - UI",
  description: "Smart Home Energy Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen">
          <SwrConfig>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              {!hideGlobalToast && <ToastContainer transition={Slide} position="bottom-right" stacked />}
            </ThemeProvider>
          </SwrConfig>
        </div>
      </body>
    </html>
  );
}
