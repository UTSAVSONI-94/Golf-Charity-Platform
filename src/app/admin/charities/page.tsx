import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function AdminCharitiesPage() {
  const charities = [
    { id: 1, name: "Global Clean Water Initiative", featured: true },
    { id: 2, name: "Youth Sports Foundation", featured: false },
    { id: 3, name: "Wildlife Conservation Fund", featured: true }
  ]

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-2 text-white">Charities</h1>
          <p className="text-neutral-400">Manage the causes users can donate their subscription percentages to.</p>
        </div>
        <button className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Plus className="w-5 h-5" /> Add Charity
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-semibold text-neutral-300">Name</th>
              <th className="p-4 font-semibold text-neutral-300">Status</th>
              <th className="p-4 font-semibold text-neutral-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {charities.map(c => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">{c.name}</td>
                <td className="p-4">
                  {c.featured ? (
                     <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">Featured</span>
                  ) : (
                     <span className="text-xs font-semibold bg-neutral-500/20 text-neutral-400 px-2 py-1 rounded-full border border-neutral-500/30">Standard</span>
                  )}
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-emerald-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
