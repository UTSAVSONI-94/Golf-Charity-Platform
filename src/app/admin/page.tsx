import { Users, DollarSign, HeartHandshake, TrendingUp } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminOverview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch real aggregated metrics from the DB
  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: subsCount } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active')
  
  // Rough estimations for pools since actual revenue requires Stripe API access
  const activeSubs = subsCount || 0
  const monthlyRevenue = activeSubs * 9.99 // Assuming $9.99 base tier
  const prizePool = monthlyRevenue * 0.40 // 40% to tier 1
  const charityPool = monthlyRevenue * 0.15 // 15% to charity

  const stats = [
    { label: "Total Users", value: (usersCount || 0).toLocaleString(), icon: Users, trend: "Live Metric" },
    { label: "Active Subscriptions", value: activeSubs.toLocaleString(), icon: TrendingUp, trend: "Live Metric" },
    { label: "Total Prize Pool", value: `$${prizePool.toFixed(2)}`, icon: DollarSign, trend: "Estimated Monthly" },
    { label: "Charity Contributions", value: `$${charityPool.toFixed(2)}`, icon: HeartHandshake, trend: "Estimated Monthly" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Analytics Overview</h1>
        <p className="text-neutral-400">High-level secure metrics for the ImpactPlay platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="glass rounded-3xl p-6 border-white/10 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 bg-white/5 w-24 h-24 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors" />
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <stat.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-neutral-400 font-medium">{stat.label}</h3>
            </div>
            <p className="text-4xl font-black text-white relative z-10 mb-2">{stat.value}</p>
            <p className="text-xs font-semibold text-blue-400 relative z-10">{stat.trend}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
