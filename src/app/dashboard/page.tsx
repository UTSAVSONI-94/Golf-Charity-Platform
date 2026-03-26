import { Trophy, Gift, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold mb-8">Welcome back, Golfer!</h1>
      
      {/* Subscription Status Card */}
      <div className="glass rounded-3xl p-8 border-l-4 border-l-emerald-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Active Subscription</h2>
            <p className="text-neutral-400">Premium Tier - Billing renews on Oct 1, 2026</p>
          </div>
          <span className="self-start md:self-auto px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
            Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div className="glass rounded-3xl p-6 flex flex-col">
          <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Recent Scores</h3>
          <p className="text-neutral-400 mb-6 flex-1">You have submitted 3/5 scores this month. Add 2 more to maximize your chances in the draw!</p>
          <Link href="/dashboard/scores" className="mt-auto inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            Manage Scores <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="glass rounded-3xl p-6 flex flex-col">
          <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
            <Gift className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">Next Draw</h3>
          <p className="text-neutral-400 mb-6 flex-1">The jackpot is currently at $12,450. Your numbers are locked in.</p>
          <Link href="/dashboard/winnings" className="mt-auto inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            View Draws <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
