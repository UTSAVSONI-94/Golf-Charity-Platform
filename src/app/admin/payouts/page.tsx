import { ShieldCheck, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { approveProof, rejectProof, markPaid } from './actions'

export default async function AdminPayoutsPage({ searchParams }: { searchParams: Promise<{ error?: string, success?: string }> }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all users from the public users table
  const { data: allDbUsers } = await supabase
    .from('users')
    .select('id, email')

  // For each user, check their metadata for proof submissions
  const proofUsers: { id: string; email: string; proof_status: string; proof_url: string; proof_notes: string; proof_submitted_at: string }[] = []

  for (const dbUser of allDbUsers || []) {
    const { data: { user: fullUser } } = await supabase.auth.admin.getUserById(dbUser.id)
    if (!fullUser) continue

    const meta = fullUser.user_metadata || {}
    if (meta.proof_submitted || meta.proof_status === 'paid') {
      proofUsers.push({
        id: dbUser.id,
        email: dbUser.email || fullUser.email || 'Unknown',
        proof_status: meta.proof_status || 'pending_review',
        proof_url: meta.proof_url || 'N/A',
        proof_notes: meta.proof_notes || '',
        proof_submitted_at: meta.proof_submitted_at || '',
      })
    }
  }

  // Sort: pending first
  const statusOrder: Record<string, number> = { 'pending_review': 0, 'approved': 1, 'rejected': 2, 'paid': 3 }
  proofUsers.sort((a, b) => (statusOrder[a.proof_status] ?? 99) - (statusOrder[b.proof_status] ?? 99))

  const pendingCount = proofUsers.filter(u => u.proof_status === 'pending_review').length
  const approvedCount = proofUsers.filter(u => u.proof_status === 'approved').length
  const paidCount = proofUsers.filter(u => u.proof_status === 'paid').length

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2 text-white">Verify Payouts</h1>
        <p className="text-neutral-400">Review proof submissions from draw winners. Approve, reject, or mark payouts as complete.</p>
      </div>

      {params.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{params.error}</p>
        </div>
      )}

      {params.success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{params.success}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 text-center border border-amber-500/20">
          <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
          <p className="text-xs text-neutral-400 mt-1">Pending Review</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border border-blue-500/20">
          <p className="text-2xl font-black text-blue-400">{approvedCount}</p>
          <p className="text-xs text-neutral-400 mt-1">Approved</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center border border-emerald-500/20">
          <p className="text-2xl font-black text-emerald-400">{paidCount}</p>
          <p className="text-xs text-neutral-400 mt-1">Paid Out</p>
        </div>
      </div>

      {/* Proof Cards */}
      <div className="grid gap-4">
        {proofUsers.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center text-neutral-500 border border-neutral-800">
            No proof submissions yet. Winners will appear here after submitting their payout proofs.
          </div>
        ) : proofUsers.map(u => (
          <div key={u.id} className={`glass rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border ${
            u.proof_status === 'pending_review' ? 'border-amber-500/30' : 
            u.proof_status === 'approved' ? 'border-blue-500/30' :
            u.proof_status === 'paid' ? 'border-emerald-500/30' : 'border-red-500/30'
          }`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="font-bold text-white text-lg truncate">{u.email}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  u.proof_status === 'pending_review' ? 'bg-amber-500/20 text-amber-400' :
                  u.proof_status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                  u.proof_status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {u.proof_status === 'pending_review' ? '⏳ Pending' :
                   u.proof_status === 'approved' ? '✅ Approved' :
                   u.proof_status === 'paid' ? '💰 Paid' : '❌ Rejected'}
                </span>
              </div>
              <p className="text-neutral-400 text-sm">
                Proof: {u.proof_url} • Submitted {u.proof_submitted_at ? new Date(u.proof_submitted_at).toLocaleDateString() : 'N/A'}
              </p>
              {u.proof_notes && (
                <p className="text-neutral-300 text-xs mt-1">Notes: &ldquo;{u.proof_notes}&rdquo;</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:min-w-[320px] justify-end shrink-0">
              {u.proof_status === 'pending_review' && (
                <>
                  <form action={approveProof}>
                    <input type="hidden" name="userId" value={u.id} />
                    <button type="submit" className="w-full py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 transition-all">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  </form>
                  <form action={rejectProof}>
                    <input type="hidden" name="userId" value={u.id} />
                    <input type="hidden" name="feedback" value="Proof does not meet requirements. Please resubmit with a valid receipt." />
                    <button type="submit" className="w-full py-2 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold flex items-center justify-center gap-2 transition-all">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </form>
                </>
              )}
              {u.proof_status === 'approved' && (
                <form action={markPaid}>
                  <input type="hidden" name="userId" value={u.id} />
                  <button type="submit" className="w-full py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <ShieldCheck className="w-4 h-4" /> Mark as Paid
                  </button>
                </form>
              )}
              {u.proof_status === 'paid' && (
                <span className="flex items-center gap-2 text-emerald-500 font-bold px-4 py-2">
                  <ShieldCheck className="w-5 h-5" /> Verified & Paid
                </span>
              )}
              {u.proof_status === 'rejected' && (
                <span className="flex items-center gap-2 text-red-400 font-medium px-4 py-2 text-sm">
                  Awaiting user resubmission
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
