import { Footer } from "@/components/landing/Footer"

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
