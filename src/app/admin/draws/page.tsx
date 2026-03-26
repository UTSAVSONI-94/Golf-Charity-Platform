'use client'

import { useState } from 'react'
import { Play, Settings2, CheckCircle } from 'lucide-react'

export default function AdminDrawsPage() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [result, setResult] = useState<number[] | null>(null)

  const handleSimulate = (type: 'random' | 'algorithmic') => {
    setIsSimulating(true)
    setTimeout(() => {
      // Dummy result generator showcasing the simulation UX
      setResult([4, 15, 23, 38, 42])
      setIsSimulating(false)
    }, 1500)
  }

  const handlePublish = () => {
    if(confirm('Are you sure you want to publish this draw and distribute the prizes?')) {
      alert('Draw Published successfully! Winners have been calculated.')
      setResult(null)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Draw Management</h1>
        <p className="text-neutral-400">Run simulations or execute the final monthly draw using our Random or Algorithmic engines.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8 border hover:border-emerald-500/50 transition-colors cursor-pointer group" onClick={() => handleSimulate('random')}>
          <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <Play className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Random Draw</h3>
          <p className="text-neutral-400 mb-6">Standard PRNG draw. Generates 5 random numbers between 1 and 45.</p>
          <button className="w-full py-3 rounded-xl bg-white/10 group-hover:bg-emerald-500 text-white font-semibold transition-colors">
            Run Random Simulation
          </button>
        </div>

        <div className="glass rounded-3xl p-8 border hover:border-emerald-500/50 transition-colors cursor-pointer group" onClick={() => handleSimulate('algorithmic')}>
          <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
            <Settings2 className="w-6 h-6 text-emerald-400 group-hover:rotate-90 transition-transform" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Algorithmic Draw</h3>
          <p className="text-neutral-400 mb-6">Analyzes the global ledger of user round scores to pick the 5 most frequent numbers.</p>
          <button className="w-full py-3 rounded-xl bg-white/10 group-hover:bg-emerald-500 text-white font-semibold transition-colors">
            Run Algorithmic Simulation
          </button>
        </div>
      </div>

      {isSimulating && (
        <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-emerald-400 font-bold animate-pulse">Running Simulation Engine...</p>
        </div>
      )}

      {result && !isSimulating && (
        <div className="glass rounded-3xl p-8 border border-emerald-500/30 bg-emerald-950/20">
          <h3 className="text-xl font-bold text-white mb-6">Simulation Result</h3>
          <div className="flex gap-4 mb-8 justify-center">
            {result.map(num => (
              <div key={num} className="w-16 h-16 rounded-full bg-emerald-500 text-white text-2xl font-black flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                {num}
              </div>
            ))}
          </div>
          
          <div className="flex gap-4">
            <button onClick={() => setResult(null)} className="flex-1 py-4 rounded-xl glass hover:bg-white/10 text-white font-bold transition-all">
              Discard Result
            </button>
            <button onClick={handlePublish} className="flex-1 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <CheckCircle className="w-5 h-5" /> Publish Draw
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
