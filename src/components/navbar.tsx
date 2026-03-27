'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, LogIn, Sparkles } from 'lucide-react'

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block text-neutral-100">Impact<span className="text-blue-400">Play</span></span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-neutral-300">
          <Link href="/charities" className="hover:text-blue-400 flex items-center gap-2 transition-colors">
            <Heart className="w-4 h-4" /> Charities
          </Link>
          <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          <Link href="/login" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-neutral-100">
            <LogIn className="w-4 h-4" /> Sign In
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
