import { Footer } from "@/components/landing/Footer"

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
