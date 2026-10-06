import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  variable: "--next-font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--next-font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REID XTREME 5.0 — Prizes",
  description: "Discover the prize pool for REID XTREME 5.0.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
