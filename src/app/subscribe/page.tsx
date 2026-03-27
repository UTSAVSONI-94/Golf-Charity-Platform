'use client'

import { motion } from 'framer-motion'
import { Check, ArrowRight, AlertTriangle } from 'lucide-react'
import { useState, use } from 'react'
import { createCheckoutSession } from './actions'

export default function SubscribePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = use(searchParams);
  const errorMsg = resolvedParams.error;
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: "Standard",
      priceMonthly: "$9.99",
      priceYearly: "$99.99",
      features: [
        "1 monthly draw entry",
        "Up to 5 Stableford scores",
        "Minimum 10% to charity",
        "Standard support"
      ]
    },
    {
      name: "Premium",
      priceMonthly: "$24.99",
      priceYearly: "$249.99",
      features: [
        "3 monthly draw entries",
        "Unlimited score history",
        "Minimum 20% to charity",
        "VIP Support & Analytics"
      ],
      popular: true
    }
  ]

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Choose Your Plan</h1>
        <p className="text-neutral-400 text-lg">Join the club. Submit scores. Win big. Give back.</p>
        
        <div className="mt-8 inline-flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-full">
          <button 
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${!isYearly ? 'bg-emerald-500 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${isYearly ? 'bg-emerald-500 text-white' : 'text-neutral-400 hover:text-white'}`}
          >
            Yearly <span className="text-[10px] bg-emerald-400/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Save 20%</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="w-full max-w-4xl mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center gap-3 text-red-400 font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`relative glass rounded-3xl p-8 flex flex-col ${plan.popular ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold">{isYearly ? plan.priceYearly : plan.priceMonthly}</span>
              <span className="text-neutral-400">/{isYearly ? 'year' : 'mo'}</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <div className="bg-emerald-500/20 p-1 rounded-full mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-neutral-300">{f}</span>
                </li>
              ))}
            </ul>

            <form action={createCheckoutSession}>
              <input type="hidden" name="planName" value={plan.name} />
              <input type="hidden" name="isYearly" value={isYearly.toString()} />
              <button type="submit" className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${plan.popular ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                Subscribe to {plan.name} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
