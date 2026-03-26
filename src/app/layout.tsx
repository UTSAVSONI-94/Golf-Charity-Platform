import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fairway to Heaven - Golf Charity Platform',
  description: 'Submit your Stableford scores, participate in monthly draws, and support amazing causes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-[#09090b] text-neutral-50 selection:bg-emerald-500/30`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
