import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jambi Core - NGO Management System",
  description: "Production-ready internal management system for NGOs with HQ, branches, and field offices. Multi-tenant SaaS or self-hosted.",
  keywords: ["NGO", "management", "humanitarian", "field operations", "beneficiary tracking"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
