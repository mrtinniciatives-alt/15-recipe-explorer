import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
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
  title: "Project Tracker",
  description: "Organize projects and track task progress.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-zinc-50 font-sans text-zinc-900">
        <header className="border-b border-zinc-200 bg-white">
          <nav className="mx-auto flex w-full max-w-6xl items-center px-6 py-4 sm:px-10 lg:px-12">
            <Link
              className="text-lg font-bold tracking-tight text-zinc-950"
              href="/"
            >
              Project Tracker
            </Link>
            <Link
              className="ml-auto rounded-lg px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              href="/stats"
            >
              Stats
            </Link>
          </nav>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="border-t border-zinc-200 bg-white px-6 py-5 text-center text-sm text-zinc-500">
          Project Tracker
        </footer>
      </body>
    </html>
  );
}
