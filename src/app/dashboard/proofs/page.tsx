import { Upload, FileUp, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { submitProof } from './actions'

export default async function ProofUploadPage({ searchParams }: { searchParams: Promise<{ error?: string, success?: string }> }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const metadata = user.user_metadata || {}
  const proofStatus = metadata.proof_status || null // null | 'pending_review' | 'approved' | 'paid' | 'rejected'
  const proofSubmitted = metadata.proof_submitted || false

  // Check if user has any active subscription (and thus could have winnings)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2">Proof of Receipt</h1>
        <p className="text-neutral-400">If you won a prize in the monthly draw, upload your proof of receipt so the admin can verify and finalize your payout.</p>
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

      {/* Status Card */}
      {proofSubmitted && (
        <div className={`glass rounded-3xl p-6 border ${
          proofStatus === 'approved' || proofStatus === 'paid'
            ? 'border-emerald-500/30 bg-emerald-950/10'
            : proofStatus === 'rejected'
            ? 'border-red-500/30 bg-red-950/10'
            : 'border-amber-500/30 bg-amber-950/10'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            {proofStatus === 'approved' || proofStatus === 'paid' ? (
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            ) : proofStatus === 'rejected' ? (
              <XCircle className="w-6 h-6 text-red-400" />
            ) : (
              <Clock className="w-6 h-6 text-amber-400" />
            )}
            <h2 className="text-xl font-bold text-white">
              {proofStatus === 'paid' && 'Payout Complete ✓'}
              {proofStatus === 'approved' && 'Proof Approved — Payout Processing'}
              {proofStatus === 'pending_review' && 'Proof Under Review'}
              {proofStatus === 'rejected' && 'Proof Rejected — Please Resubmit'}
            </h2>
          </div>
          <p className="text-sm text-neutral-400">
            Submitted on {new Date(metadata.proof_submitted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          {metadata.proof_notes && (
            <p className="text-sm text-neutral-300 mt-2">Your notes: "{metadata.proof_notes}"</p>
          )}
          {metadata.admin_feedback && (
            <p className="text-sm text-amber-300 mt-2 font-medium">Admin feedback: "{metadata.admin_feedback}"</p>
          )}
        </div>
      )}

      {/* Upload Form - Show if no proof submitted or rejected */}
      {(!proofSubmitted || proofStatus === 'rejected') && (
        <form action={submitProof} className="glass rounded-3xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Proof Reference</label>
            <input
              type="text"
              name="proofUrl"
              placeholder="Paste receipt URL, transaction ID, or reference number"
              className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Additional Notes (Optional)</label>
            <textarea
              name="notes"
              placeholder="Any additional context about your payout..."
              rows={3}
              className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            />
          </div>

          <button type="submit" className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Upload className="w-5 h-5" /> Submit Proof
          </button>
        </form>
      )}

      {/* Payment Tracking Timeline */}
      <div className="glass rounded-3xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Verification Pipeline</h2>
        <div className="space-y-4">
          {[
            { step: '1', label: 'Win Draw', desc: 'Match 3+ numbers in the monthly draw', done: true },
            { step: '2', label: 'Submit Proof', desc: 'Upload your receipt or reference', done: proofSubmitted },
            { step: '3', label: 'Admin Review', desc: 'Admin verifies your submission', done: proofStatus === 'approved' || proofStatus === 'paid' },
            { step: '4', label: 'Payout Complete', desc: 'Funds transferred to your account', done: proofStatus === 'paid' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${s.done ? 'bg-emerald-500 text-white' : 'bg-white/10 text-neutral-400'}`}>
                {s.done ? '✓' : s.step}
              </div>
              <div>
                <p className={`font-semibold ${s.done ? 'text-emerald-400' : 'text-neutral-300'}`}>{s.label}</p>
                <p className="text-xs text-neutral-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
