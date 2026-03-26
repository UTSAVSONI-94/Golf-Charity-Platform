import { Search } from 'lucide-react'

export default function AdminUsersPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Users & Subscriptions</h1>
        <p className="text-neutral-400">Manage user accounts and view their Stripe subscription status.</p>
      </div>

      <div className="glass rounded-3xl p-6 mb-6 flex gap-4 items-center">
        <Search className="w-5 h-5 text-neutral-500" />
        <input type="text" placeholder="Search users by email or ID..." className="bg-transparent border-none outline-none text-white w-full placeholder:text-neutral-600" />
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="p-4 font-semibold text-neutral-300">User Email</th>
              <th className="p-4 font-semibold text-neutral-300">Plan</th>
              <th className="p-4 font-semibold text-neutral-300">Status</th>
              <th className="p-4 font-semibold text-neutral-300">Scores Logged</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map(i => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">golfer{i}@example.com</td>
                <td className="p-4 text-neutral-400">Premium</td>
                <td className="p-4">
                  <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">Active</span>
                </td>
                <td className="p-4 text-neutral-400">5 / 5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
