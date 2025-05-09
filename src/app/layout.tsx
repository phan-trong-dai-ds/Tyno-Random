
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";
import { LanguageProvider } from "@/context/language-context";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

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
    <html lang="en" suppressHydrationWarning className={beVietnamPro.className}>
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

