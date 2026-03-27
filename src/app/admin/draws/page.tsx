import { Play, Settings2, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { simulateDraw, publishDraw } from './actions'

export default async function AdminDrawsPage({ searchParams }: { searchParams: Promise<{ simulation?: string, mode?: string, error?: string, success?: string }> }) {
  const params = await searchParams
  const simulationNumbers = params.simulation?.split(',').map(Number) || null
  const drawMode = params.mode || 'random'
  const errorMsg = params.error
  const successMsg = params.success

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get stats for context
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: qualifiedUsers } = await supabase.from('scores').select('user_id', { count: 'exact', head: true })

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Draw Management</h1>
        <p className="text-neutral-400">Run simulations or execute the final monthly draw using our Random or Algorithmic engines.</p>
        <div className="flex gap-4 mt-3">
          <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-medium">
            {totalUsers || 0} Total Users
          </span>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            Users with Scores: {qualifiedUsers || 0}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{successMsg}</p>
        </div>
      )}

      {/* Simulation Mode Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        <form action={simulateDraw}>
          <input type="hidden" name="mode" value="random" />
          <button type="submit" className="w-full glass rounded-3xl p-8 border hover:border-blue-500/50 transition-colors cursor-pointer group text-left">
            <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Play className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Random Draw</h3>
            <p className="text-neutral-400 mb-6">Standard PRNG draw. Generates 5 unique random numbers between 1 and 45.</p>
            <span className="w-full py-3 rounded-xl bg-white/10 group-hover:bg-blue-500 text-white font-semibold transition-colors block text-center">
              Run Random Simulation
            </span>
          </button>
        </form>

        <form action={simulateDraw}>
          <input type="hidden" name="mode" value="algorithmic" />
          <button type="submit" className="w-full glass rounded-3xl p-8 border hover:border-emerald-500/50 transition-colors cursor-pointer group text-left">
            <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Settings2 className="w-6 h-6 text-emerald-400 group-hover:rotate-90 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Algorithmic Draw</h3>
            <p className="text-neutral-400 mb-6">Analyzes the global ledger of all user scores to pick the 5 most statistically frequent numbers.</p>
            <span className="w-full py-3 rounded-xl bg-white/10 group-hover:bg-emerald-500 text-white font-semibold transition-colors block text-center">
              Run Algorithmic Simulation
            </span>
          </button>
        </form>
      </div>

      {/* Simulation Result */}
      {simulationNumbers && simulationNumbers.length === 5 && (
        <div className="glass rounded-3xl p-8 border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Simulation Result</h3>
            <span className="text-xs bg-white/10 text-neutral-300 px-3 py-1 rounded-full font-medium capitalize">
              {drawMode} Engine
            </span>
          </div>

          <div className="flex gap-4 mb-8 justify-center">
            {simulationNumbers.map((num, i) => (
              <div key={i} className="w-16 h-16 rounded-full bg-emerald-500 text-white text-2xl font-black flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                {num}
              </div>
            ))}
          </div>

          <p className="text-neutral-400 text-sm text-center mb-6">
            These numbers are a simulation preview. Click "Publish Draw" to save to the database, compute all user matches, split the prize pool, and trigger winner notifications.
          </p>
          
          <div className="flex gap-4">
            <a href="/admin/draws" className="flex-1 py-4 rounded-xl glass hover:bg-white/10 text-white font-bold transition-all text-center flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" /> Discard & Re-run
            </a>
            <form action={publishDraw} className="flex-1">
              <input type="hidden" name="numbers" value={simulationNumbers.join(',')} />
              <input type="hidden" name="mode" value={drawMode} />
              <button type="submit" className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <CheckCircle className="w-5 h-5" /> Publish Draw
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
