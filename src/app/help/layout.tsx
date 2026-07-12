import { Footer } from "@/components/landing/Footer"

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
