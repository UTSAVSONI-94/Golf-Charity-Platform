import { Gift, CheckCircle, Clock } from 'lucide-react'

export default function WinningsPage() {
  const getMonthStr = (offset: number) => {
    const d = new Date()
    d.setMonth(d.getMonth() + offset)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const history = [
    { id: '1', date: getMonthStr(1), draw_numbers: [4, 12, 23, 31, 42], my_matches: 4, prize: '$1,240.00', status: 'paid' },
    { id: '2', date: getMonthStr(0), draw_numbers: [7, 14, 25, 33, 41], my_matches: 2, prize: '$0.00', status: 'none' },
    { id: '3', date: getMonthStr(-1), draw_numbers: [2, 11, 22, 36, 45], my_matches: 3, prize: '$350.50', status: 'pending' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold mb-2">Draws & Winnings</h1>
        <p className="text-neutral-400">View your participation in the algorithmic draws and track your payouts.</p>
      </div>

      <div className="grid gap-6">
        {history.map((h) => (
          <div key={h.id} className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/20 p-2 rounded-lg">
                  <Gift className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold">{h.date} Draw</h3>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500 mb-2 uppercase tracking-wider font-semibold">Winning Numbers</p>
                <div className="flex gap-2">
                  {h.draw_numbers.map(n => (
                    <div key={n} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-neutral-300">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-8 flex flex-col justify-center min-w-[200px]">
              <p className="text-neutral-400 text-sm mb-1">Your Matches: <strong className="text-white">{h.my_matches}/5</strong></p>
              <p className="text-3xl font-black text-emerald-400 mb-3">{h.prize}</p>
              
              {h.status === 'paid' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit">
                  <CheckCircle className="w-3.5 h-3.5" /> Payout Complete
                </span>
              )}
              {h.status === 'pending' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full w-fit">
                  <Clock className="w-3.5 h-3.5" /> Action Required (Upload Proof)
                </span>
              )}
              {h.status === 'none' && (
                <span className="text-xs text-neutral-500 font-medium">No prize this round</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
