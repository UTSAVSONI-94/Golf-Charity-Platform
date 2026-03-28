import { Users, DollarSign, HeartHandshake, TrendingUp, Activity, Award } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Live metrics from DB
  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: subsCount } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
  const { count: totalScores } = await supabase.from('scores').select('*', { count: 'exact', head: true })
  const { count: charityCount } = await supabase.from('charities').select('*', { count: 'exact', head: true })

  const activeSubs = subsCount || 0
  const monthlyRevenue = activeSubs * 9.99
  const prizePool = monthlyRevenue * 0.45
  const charityPool = monthlyRevenue * 0.10 // Minimum 10% per user

  const stats = [
    { label: "Total Users", value: (usersCount || 0).toLocaleString(), icon: Users, trend: "Live from DB", color: "blue" },
    { label: "Active Subscriptions", value: activeSubs.toLocaleString(), icon: TrendingUp, trend: "Live from DB", color: "emerald" },
    { label: "Monthly Revenue", value: `$${monthlyRevenue.toFixed(2)}`, icon: DollarSign, trend: `${activeSubs} × $9.99`, color: "green" },
    { label: "Prize Pool", value: `$${prizePool.toFixed(2)}`, icon: Award, trend: "45% of revenue", color: "purple" },
    { label: "Min Charity Pool", value: `$${charityPool.toFixed(2)}`, icon: HeartHandshake, trend: "10%+ per user", color: "pink" },
    { label: "Total Score Entries", value: (totalScores || 0).toLocaleString(), icon: Activity, trend: "All-time", color: "amber" },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    green: 'bg-green-500/20 text-green-400',
    purple: 'bg-purple-500/20 text-purple-400',
    pink: 'bg-pink-500/20 text-pink-400',
    amber: 'bg-amber-500/20 text-amber-400',
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Analytics Overview</h1>
        <p className="text-neutral-400">Real-time metrics from Supabase PostgreSQL. All values are computed live.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="glass rounded-3xl p-6 border-white/10 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 bg-white/5 w-24 h-24 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className={`p-3 rounded-xl ${colorMap[stat.color]?.split(' ')[0] || 'bg-blue-500/20'}`}>
                <stat.icon className={`w-6 h-6 ${colorMap[stat.color]?.split(' ')[1] || 'text-blue-400'}`} />
              </div>
              <h3 className="text-neutral-400 font-medium">{stat.label}</h3>
            </div>
            <p className="text-4xl font-black text-white relative z-10 mb-2">{stat.value}</p>
            <p className={`text-xs font-semibold relative z-10 ${colorMap[stat.color]?.split(' ')[1] || 'text-blue-400'}`}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Platform Health */}
      <div className="glass rounded-3xl p-6 border border-white/10">
        <h2 className="text-xl font-bold text-white mb-4">Platform Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-neutral-400">Conversion Rate</p>
            <p className="text-2xl font-black text-white">{usersCount ? ((activeSubs / (usersCount || 1)) * 100).toFixed(1) : 0}%</p>
          </div>
          <div>
            <p className="text-sm text-neutral-400">Avg Scores/User</p>
            <p className="text-2xl font-black text-white">{usersCount ? ((totalScores || 0) / (usersCount || 1)).toFixed(1) : 0}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-400">Active Charities</p>
            <p className="text-2xl font-black text-white">{charityCount || 0}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-400">Annual Projection</p>
            <p className="text-2xl font-black text-emerald-400">${(monthlyRevenue * 12).toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
