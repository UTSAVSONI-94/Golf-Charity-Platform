'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Globe, HeartHandshake, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden pt-32 pb-20">
      {/* SaaS Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-background to-background pointer-events-none" />
      
      <section className="w-full max-w-7xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Funding World-Changing Causes
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight text-neutral-100"
        >
          Compete on the course. <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Change lives off it.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed"
        >
          Join a community of purpose-driven competitors. Your performance fuels our algorithmic impact pool, guaranteeing verified charities receive the support they deserve.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link href="/subscribe" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-neutral-100 text-neutral-900 hover:bg-white font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] group hover:scale-[1.02] active:scale-[0.98]">
            Subscribe Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/charities" className="w-full sm:w-auto px-8 py-4 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300 font-semibold text-lg flex items-center justify-center transition-all backdrop-blur-sm">
            Our Foundation
          </Link>
        </motion.div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 mt-32 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: ShieldCheck, title: "Verified Impact", desc: "Every charity is fully vetting. A guaranteed 10% of all subscriptions directly funds these global initiatives." },
          { icon: Globe, title: "Algorithmic Fairness", desc: "Our transparent, mathematically-driven draw system ensures every eligible participant has a fair chance to win." },
          { icon: HeartHandshake, title: "Purpose-Driven", desc: "We are building a new standard where competitive engagement directly translates to real-world philanthropy." }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
            className="group relative rounded-3xl border border-neutral-800 bg-neutral-900/40 p-8 hover:bg-neutral-800/60 transition-colors duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-neutral-200">{feature.title}</h3>
            <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </main>
  )
}
