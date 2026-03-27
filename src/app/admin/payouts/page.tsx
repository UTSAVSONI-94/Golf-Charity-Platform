import { ShieldCheck, CheckCircle, Search } from 'lucide-react'

export default function AdminPayoutsPage() {
  const getMonthStr = (offset: number) => {
    const d = new Date()
    d.setMonth(d.getMonth() + offset)
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  const todayStr = new Date().toISOString().split('T')[0]

  const payouts = [
    { id: '1', user: "john.doe@example.com", draw: getMonthStr(-1), match: "Tier 3", amount: "$350.50", status: "pending", date: todayStr },
    { id: '2', user: "jane.smith@example.com", draw: getMonthStr(-1), match: "Tier 1", amount: "$10,400.00", status: "pending", date: todayStr },
    { id: '3', user: "mike.jones@example.com", draw: getMonthStr(-2), match: "Tier 2", amount: "$1,200.00", status: "paid", date: todayStr },
  ]

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Verify Payouts</h1>
        <p className="text-neutral-400">Review payout proofs uploaded by users and mark transactions as complete.</p>
      </div>

      <div className="glass rounded-3xl p-6 mb-6 flex gap-4 items-center">
        <Search className="w-5 h-5 text-neutral-500" />
        <input type="text" placeholder="Search by email..." className="bg-transparent border-none outline-none text-white w-full placeholder:text-neutral-600" />
      </div>

      <div className="grid gap-4">
        {payouts.map(p => (
          <div key={p.id} className={`glass rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border ${p.status === 'pending' ? 'border-amber-500/30' : 'border-white/10'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-white text-lg">{p.user}</span>
                <span className="text-xs font-semibold bg-white/10 text-neutral-300 px-2 py-1 rounded-full">{p.draw}</span>
              </div>
              <p className="text-neutral-400 text-sm">Matches: {p.match} • Generated on {p.date}</p>
            </div>

            <div className="text-left md:text-right hidden sm:block">
              <p className="text-3xl font-black text-emerald-400">{p.amount}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:min-w-[280px] justify-end">
              {p.status === 'pending' ? (
                <>
                  <button className="flex-1 py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center justify-center gap-2 transition-all">
                    View Proof
                  </button>
                  <button className="flex-1 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <CheckCircle className="w-4 h-4" /> Mark Paid
                  </button>
                </>
              ) : (
                <span className="flex items-center justify-center md:justify-end gap-2 text-emerald-500 font-bold px-4 py-2">
                  <ShieldCheck className="w-5 h-5" /> Verified & Paid
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
