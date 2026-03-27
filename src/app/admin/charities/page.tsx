import { Plus, Edit2, Trash2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminCharitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: charities } = await supabase.from('charities').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white">Charities</h1>
          <p className="text-neutral-400">Manage the secured list of impact causes users can donate via subscription tiers.</p>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-semibold text-neutral-300">Name</th>
              <th className="p-4 font-semibold text-neutral-300">Status</th>
              <th className="p-4 font-semibold text-neutral-300 mt-0 text-right">Added On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {charities?.map(c => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">{c.name}</td>
                <td className="p-4">
                  {c.featured ? (
                     <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">Featured</span>
                  ) : (
                     <span className="text-xs font-semibold bg-neutral-500/20 text-neutral-400 px-2 py-1 rounded-full border border-neutral-500/30">Standard</span>
                  )}
                </td>
                <td className="p-4 text-right text-neutral-400 text-sm">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!charities || charities.length === 0) && (
              <tr><td colSpan={3} className="p-8 text-center text-neutral-500">No active charities found in the database. Add one via Postgres to manage.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
