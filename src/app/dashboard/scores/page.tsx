'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'

export default function ScoresPage() {
  const [scores, setScores] = useState([
    { id: 1, score: 38, date: '2026-03-24' },
    { id: 2, score: 40, date: '2026-03-20' },
    { id: 3, score: 35, date: '2026-03-15' },
  ])
  
  const [newScore, setNewScore] = useState('')
  
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newScore || parseInt(newScore) < 1 || parseInt(newScore) > 45) return
    
    // Simulate DB trigger behavior: max 5 scores, delete oldest
    let updated = [{ id: Date.now(), score: parseInt(newScore), date: new Date().toISOString().split('T')[0] }, ...scores]
    if (updated.length > 5) updated = updated.slice(0, 5)
    
    setScores(updated)
    setNewScore('')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-2">My Scores</h1>
        <p className="text-neutral-400">Submit your Stableford scores (1-45). Only your latest 5 scores are kept for the draw algorithm.</p>
      </div>

      {/* Add Score Form */}
      <form onSubmit={handleAdd} className="glass rounded-3xl p-6 flex flex-col sm:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Stableford Score</label>
          <input 
            type="number" 
            min="1" max="45"
            value={newScore}
            onChange={e => setNewScore(e.target.value)}
            placeholder="e.g. 36"
            className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <Plus className="w-5 h-5" /> Add Score
        </button>
      </form>

      {/* Score List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Latest Scores ({scores.length}/5)</h2>
        {scores.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center text-neutral-500">
            No scores submitted yet. Add your first score above!
          </div>
        ) : (
          <div className="grid gap-4">
            {scores.map((s, i) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-4 md:p-6 flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-emerald-400">{s.score}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">Stableford Round</p>
                    <p className="text-neutral-400 text-sm">Played on {s.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setScores(scores.filter(score => score.id !== s.id))}
                  className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors md:opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
