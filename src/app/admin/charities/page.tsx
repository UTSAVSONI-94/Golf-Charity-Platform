import { Plus, Trash2, Star, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { addCharity, deleteCharity, toggleFeatured } from './actions'

export default async function AdminCharitiesPage({ searchParams }: { searchParams: Promise<{ error?: string, success?: string }> }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: charities } = await supabase.from('charities').select('*').order('featured', { ascending: false })

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white">Charities</h1>
          <p className="text-neutral-400">Add, remove, or feature charities that users can allocate their contributions to.</p>
        </div>
      </div>

      {params.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{params.error}</p>
        </div>
      )}

      {params.success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{params.success}</p>
        </div>
      )}

      {/* Add Charity Form */}
      <form action={addCharity} className="glass rounded-3xl p-6 flex flex-col sm:flex-row items-end gap-4 border border-neutral-800">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Charity Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Ocean Cleanup Foundation"
            className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            required
          />
        </div>
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
          <input
            type="text"
            name="description"
            placeholder="Brief mission statement..."
            className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-all">
          <Plus className="w-5 h-5" /> Add
        </button>
      </form>

      {/* Charity Table */}
      <div className="glass rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-semibold text-neutral-300">Name</th>
              <th className="p-4 font-semibold text-neutral-300">Description</th>
              <th className="p-4 font-semibold text-neutral-300">Status</th>
              <th className="p-4 font-semibold text-neutral-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {charities?.map(c => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">{c.name}</td>
                <td className="p-4 text-neutral-400 text-sm max-w-xs truncate">{c.description || '—'}</td>
                <td className="p-4">
                  {c.featured ? (
                    <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                      ★ Featured
                    </span>
                  ) : (
                    <span className="text-xs font-semibold bg-neutral-500/20 text-neutral-400 px-2 py-1 rounded-full border border-neutral-500/30">
                      Standard
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex gap-2 justify-end">
                    <form action={toggleFeatured}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="featured" value={c.featured ? 'true' : 'false'} />
                      <button type="submit" className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors" title={c.featured ? 'Remove Featured' : 'Make Featured'}>
                        <Star className="w-4 h-4" />
                      </button>
                    </form>
                    <form action={deleteCharity}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete Charity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!charities || charities.length === 0) && (
              <tr><td colSpan={4} className="p-8 text-center text-neutral-500">No charities yet. Add one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
