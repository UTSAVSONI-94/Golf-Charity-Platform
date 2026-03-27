import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { addScore, deleteScore } from './actions'

export default async function ScoresPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = await searchParams;
  const errorMsg = resolvedParams.error;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch user's real scores from Supabase
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  // Default to today's date
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-neutral-100">My Entries</h1>
        <p className="text-neutral-400">Submit your performance metrics (1-45). Only your latest 5 entries are kept for the impact draw algorithm.</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Add Score Form */}
      <form action={addScore} className="glass rounded-3xl p-6 flex flex-col sm:flex-row items-end gap-4 border border-neutral-800 bg-neutral-900/40">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Performance Metric</label>
          <input 
            type="number" 
            name="score"
            min="1" max="45"
            placeholder="e.g. 36"
            className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            required
          />
          <input type="hidden" name="date" value={today} />
        </div>
        <button 
          type="submit"
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          <Plus className="w-5 h-5" /> Add Entry
        </button>
      </form>

      {/* Score List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-200">Latest Entries ({(scores || []).length}/5)</h2>
        {!scores || scores.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center text-neutral-500 border border-neutral-800">
            No entries submitted yet. Add your first entry above!
          </div>
        ) : (
          <div className="grid gap-4">
            {scores.map((s, i) => (
              <div 
                key={s.id}
                className="glass rounded-2xl p-4 md:p-6 flex items-center justify-between group border border-neutral-800 hover:bg-neutral-800/40 transition-colors"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-blue-400">{s.score}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">Performance Entry</p>
                    <p className="text-neutral-400 text-sm">Submitted on {s.date}</p>
                  </div>
                </div>
                <form action={deleteScore}>
                  <input type="hidden" name="scoreId" value={s.id} />
                  <button 
                    type="submit"
                    className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors md:opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
