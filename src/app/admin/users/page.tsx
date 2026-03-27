import { Search } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false })
  const { data: subscriptions } = await supabase.from('subscriptions').select('*')

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Users & Subscriptions</h1>
        <p className="text-neutral-400">Manage user accounts and view their live secure Stripe subscription status.</p>
      </div>

      <div className="glass rounded-3xl overflow-hidden mt-6">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-semibold text-neutral-300">User Email</th>
              <th className="p-4 font-semibold text-neutral-300">Plan</th>
              <th className="p-4 font-semibold text-neutral-300">Status</th>
              <th className="p-4 font-semibold text-neutral-300">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users?.map(u => {
              const sub = subscriptions?.find(s => s.user_id === u.id)
              return (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{u.email}</td>
                  <td className="p-4 text-neutral-400 capitalize">{sub?.plan_type || 'Free'}</td>
                  <td className="p-4">
                    {sub?.status === 'active' ? (
                      <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">Active</span>
                    ) : (
                      <span className="text-xs font-semibold bg-neutral-500/20 text-neutral-400 px-2 py-1 rounded-full border border-neutral-500/30">Inactive</span>
                    )}
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
