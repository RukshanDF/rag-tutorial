import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ComputeIQ Tech | Technology That Moves You Forward",
  description:
    "Premium modern electronics in New York, NY, USA. Discover high-performance laptops, wireless earbuds, and chargers with direct Gemini AI assistance.",
  keywords: [
    "ComputeIQ Tech",
    "NovaBook Air",
    "NovaBook Pro",
    "NovaBuds",
    "Electronics New York",
    "AI Customer Support",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark scroll-smooth`} suppressHydrationWarning>
      <body
        className="min-h-screen bg-[#070b14] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
