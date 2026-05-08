import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Legal - ProStep2Market",
  description: "Legal documents and policies",
};

export default function LegalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LegalLayout>{children}</LegalLayout>;
}