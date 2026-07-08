import type { Metadata } from "next";
import { Press_Start_2P, DotGothic16, VT323 } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const gothicFont = DotGothic16({
  variable: "--font-gothic",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const vtFont = VT323({
  variable: "--font-vt",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KotobaQuest - 8-bit RPG Belajar Bahasa Jepang",
  description:
    "Petualangan epik mempelajari bahasa Jepang dari Dasar hingga JLPT N1. Bertarung, menjelajah, dan kuasai huruf, kosakata, dan kanji dalam dunia RPG 8-bit modern.",
  keywords: [
    "KotobaQuest",
    "Belajar Bahasa Jepang",
    "JLPT",
    "Hiragana",
    "Katakana",
    "Kanji",
    "RPG Game",
    "8-bit",
    "Edukasi",
  ],
  authors: [{ name: "KotobaQuest Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${pixelFont.variable} ${gothicFont.variable} ${vtFont.variable} antialiased bg-kq-bg text-kq-fg`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
