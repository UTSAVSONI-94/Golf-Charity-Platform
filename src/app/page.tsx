'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Trophy, HeartHandshake, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center overflow-hidden pt-32 pb-20">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 blur-[120px] rounded-full pointer-events-none" />

      <section className="w-full max-w-7xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Next Draw in 12 Days
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight"
        >
          Drive your scores. <br/>
          <span className="text-gradient">Empower charities.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 text-lg md:text-xl text-neutral-400 max-w-2xl"
        >
          Submit your Stableford scores, participate in our monthly algorithmic lotteries, 
          and guarantee a minimum 10% of your subscription goes straight to incredible charities.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/subscribe" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] group">
            Start Playing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/charities" className="w-full sm:w-auto px-8 py-4 rounded-xl glass hover:bg-white/10 text-white font-semibold text-lg flex items-center justify-center transition-all">
            View Charities
          </Link>
        </motion.div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 mt-32 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Trophy, title: "Submit Scores", desc: "Upload up to 5 of your latest Stableford scores." },
          { icon: Zap, title: "Win the Draw", desc: "Our algorithm matches your scores to the monthly jackpot." },
          { icon: HeartHandshake, title: "Give Back", desc: "You decide how much to allocate to verified charities." }
        ].map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
            className="glass card-gradient rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="bg-emerald-500/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
              <feature.icon className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-neutral-400 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </main>
  )
}
