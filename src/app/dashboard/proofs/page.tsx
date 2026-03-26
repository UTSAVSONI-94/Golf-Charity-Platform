'use client'

import { Upload, FileUp, CheckCircle } from 'lucide-react'
import { useState } from 'react'

export default function ProofUploadPage() {
  const [uploaded, setUploaded] = useState(false)

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    setUploaded(true)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2">Upload Proof of Receipt</h1>
        <p className="text-neutral-400">If you have won a prize, you must upload a screenshot or PDF receipt of your payout to finalize the transaction. Transparency is key to our charity mission.</p>
      </div>

      {!uploaded ? (
        <form onSubmit={handleUpload} className="glass rounded-3xl p-8 space-y-6">
          <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <h3 className="text-amber-400 font-bold mb-1">Pending Payout: $350.50</h3>
            <p className="text-amber-200/70 text-sm">Draw: August 2026 (Tier 3 Match)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Proof File</label>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/5 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-10 h-10 text-neutral-400 mb-3" />
                <p className="mb-2 text-sm text-neutral-300"><span className="font-semibold text-emerald-400">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-neutral-500">PNG, JPG or PDF (MAX. 5MB)</p>
              </div>
              <input type="file" className="hidden" required />
            </label>
          </div>

          <button type="submit" className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-all">
            <Upload className="w-5 h-5" /> Submit Proof
          </button>
        </form>
      ) : (
        <div className="glass rounded-3xl p-10 text-center space-y-4 border-emerald-500/30">
          <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Proof Submitted Successfully</h2>
          <p className="text-neutral-400">Your proof is being reviewed by the admin team. Your payout will be marked as Complete shortly.</p>
        </div>
      )}
    </div>
  )
}
