import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import HeaderSearch from "./components/header-search";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Explorer",
  description: "Find your next favorite recipe.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-zinc-900">
        <header className="border-b border-zinc-200 bg-white">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-5 px-6 py-4 sm:px-10 lg:px-12">
            <Link
              className="shrink-0 text-lg font-bold tracking-tight text-emerald-950"
              href="/"
            >
              Recipe Explorer
            </Link>
            <HeaderSearch />
          </nav>
        </header>
        {children}
        <footer className="border-t border-zinc-200 px-6 py-6 text-center text-sm text-zinc-500">
          Made for curious cooks.
        </footer>
      </body>
    </html>
  );
}
