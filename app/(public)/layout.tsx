'use client'

import Header from '@/components/home/HeaderSection'
import Footer from '@/components/home/FooterSection'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center">{children}</main>
      <Footer />
    </>
  )
}
