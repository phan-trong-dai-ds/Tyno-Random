
import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans"; // Commented out to fix module not found error
// import { GeistMono } from "geist/font/mono"; // Commented out to fix module not found error
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { LanguageProvider } from "@/context/language-context";

export const metadata: Metadata = {
  title: "Random Funhouse", // Remains in English for SEO or can be dynamic later
  description: "A collection of fun random games to pass the time.", // Remains in English
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased`} 
      >
        <LanguageProvider>
          <AppLayout>{children}</AppLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
