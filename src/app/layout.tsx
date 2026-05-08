import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}