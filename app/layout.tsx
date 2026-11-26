import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "From Prompt to Product",
  description: "Workshop labs: the art of building with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-4">
          <Link href="/" className="font-bold tracking-tight">
            From Prompt <span className="text-mint">to Product</span>
          </Link>
          <Link href="/vote" className="btn !px-4 !py-1.5 text-sm">Live vote</Link>
        </header>
        <main className="mx-auto max-w-5xl px-5 pb-20 pt-4">{children}</main>
      </body>
    </html>
  );
}
