import { Users as UsersIcon, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch users, subscriptions, and score counts
  const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false })
  const { data: subscriptions } = await supabase.from('subscriptions').select('*')
  const { data: scores } = await supabase.from('scores').select('user_id')

  // Build score count map
  const scoreCountMap: Record<string, number> = {}
  for (const s of scores || []) {
    scoreCountMap[s.user_id] = (scoreCountMap[s.user_id] || 0) + 1
  }

  const totalUsers = users?.length || 0
  const activeSubs = subscriptions?.filter(s => s.status === 'active').length || 0
  const usersWithScores = Object.keys(scoreCountMap).length
  const qualifiedUsers = Object.values(scoreCountMap).filter(c => c >= 5).length

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Users & Subscriptions</h1>
        <p className="text-neutral-400">View all registered users, their subscription status, and draw qualification.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-4 text-center border border-blue-500/20">
          <p className="text-2xl font-black text-blue-400">{totalUsers}</p>
          <p className="text-xs text-neutral-400 mt-1">Total Users</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border border-emerald-500/20">
          <p className="text-2xl font-black text-emerald-400">{activeSubs}</p>
          <p className="text-xs text-neutral-400 mt-1">Active Subs</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border border-amber-500/20">
          <p className="text-2xl font-black text-amber-400">{usersWithScores}</p>
          <p className="text-xs text-neutral-400 mt-1">With Scores</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border border-purple-500/20">
          <p className="text-2xl font-black text-purple-400">{qualifiedUsers}</p>
          <p className="text-xs text-neutral-400 mt-1">Draw Qualified (5/5)</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass rounded-3xl overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-semibold text-neutral-300">Email</th>
              <th className="p-4 font-semibold text-neutral-300">Plan</th>
              <th className="p-4 font-semibold text-neutral-300">Status</th>
              <th className="p-4 font-semibold text-neutral-300">Scores</th>
              <th className="p-4 font-semibold text-neutral-300">Draw Ready</th>
              <th className="p-4 font-semibold text-neutral-300">Renewal</th>
              <th className="p-4 font-semibold text-neutral-300">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users?.map(u => {
              const sub = subscriptions?.find(s => s.user_id === u.id)
              const numScores = scoreCountMap[u.id] || 0
              const isQualified = numScores >= 5

              return (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{u.email}</td>
                  <td className="p-4 text-neutral-400 capitalize">{sub?.plan_type || 'Free'}</td>
                  <td className="p-4">
                    {sub?.status === 'active' ? (
                      <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">Active</span>
                    ) : sub?.status === 'past_due' ? (
                      <span className="text-xs font-semibold bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full border border-amber-500/30">Past Due</span>
                    ) : (
                      <span className="text-xs font-semibold bg-neutral-500/20 text-neutral-400 px-2 py-1 rounded-full border border-neutral-500/30">Inactive</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`font-bold ${numScores >= 5 ? 'text-emerald-400' : 'text-neutral-400'}`}>
                      {numScores}/5
                    </span>
                  </td>
                  <td className="p-4">
                    {isQualified ? (
                      <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">✓ Qualified</span>
                    ) : (
                      <span className="text-xs font-semibold bg-neutral-500/20 text-neutral-500 px-2 py-1 rounded-full">Not Yet</span>
                    )}
                  </td>
                  <td className="p-4 text-neutral-400 text-sm">
                    {sub?.end_date ? new Date(sub.end_date).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-4 text-neutral-400 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
