import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from '@/components/landing/Navbar'

export const metadata: Metadata = {
  title: "Prostep2market",
  description: "Trading Discipline Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
