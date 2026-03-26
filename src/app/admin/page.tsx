import { Users, DollarSign, HeartHandshake, TrendingUp } from 'lucide-react'

export default function AdminOverview() {
  const stats = [
    { label: "Total Users", value: "1,248", icon: Users, trend: "+12% this month" },
    { label: "Total Prize Pool", value: "$45,200", icon: DollarSign, trend: "+8% this month" },
    { label: "Charity Contributions", value: "$12,450", icon: HeartHandshake, trend: "+15% this month" },
    { label: "Active Subscriptions", value: "1,120", icon: TrendingUp, trend: "+5% this month" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Analytics Overview</h1>
        <p className="text-neutral-400">High-level metrics for the Golf Charity platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="glass rounded-3xl p-6 border-white/10 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 bg-white/5 w-24 h-24 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="bg-emerald-500/20 p-3 rounded-xl">
                <stat.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-neutral-400 font-medium">{stat.label}</h3>
            </div>
            <p className="text-4xl font-black text-white relative z-10 mb-2">{stat.value}</p>
            <p className="text-xs font-semibold text-emerald-400 relative z-10">{stat.trend}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
