import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AirNews - Latest News with AI Summaries",
  description: "Get the latest news from India and around the world with AI-powered summaries for quick understanding.",
  keywords: "news, india news, international news, daily news, breaking news",
  openGraph: {
    title: "AirNews - Latest News with AI Summaries",
    description: "Get the latest news from India and around the world with AI-powered summaries",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Header />
          <main className="flex-1 w-full pt-8 pb-8">
            {children}
          </main>
          <Footer />
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}
