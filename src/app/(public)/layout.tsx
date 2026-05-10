import { Footer } from '@/components/landing/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main>
        {children}
      </main>
      <Footer />
    </>
  )
}
