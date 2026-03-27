import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ImpactPlay | Competitive Philanthropy',
  description: 'Join a community of purpose-driven competitors. Your performance fuels our algorithmic impact pool for verified charities.',
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
