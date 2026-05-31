import type { Metadata } from "next";
import { Hanken_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "./_components/SmoothScroll";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ofir Cohen — Frontend Engineer",
  description:
    "Frontend engineer building production AI SaaS. Server-first React, real-time streams, motion that never blocks a click. The interface is the proof.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${hanken.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full overflow-x-clip bg-bg text-ink">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
