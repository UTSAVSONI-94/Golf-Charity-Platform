'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const proofSchema = z.object({
  proofUrl: z.string().min(1, 'Proof URL is required'),
  notes: z.string().optional(),
})

// User submits proof of receipt for a winning payout
export async function submitProof(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const proofUrl = formData.get('proofUrl') as string || 'uploaded_proof_' + Date.now()
  const notes = formData.get('notes') as string || ''

  // Update the user's metadata with proof submission
  const { error } = await supabase.auth.updateUser({
    data: {
      proof_submitted: true,
      proof_url: proofUrl,
      proof_notes: notes,
      proof_submitted_at: new Date().toISOString(),
      proof_status: 'pending_review', // pending_review → approved → paid | rejected
    }
  })

  if (error) {
    redirect(`/dashboard/proofs?error=${encodeURIComponent('Failed to submit proof: ' + error.message)}`)
  }

  redirect('/dashboard/proofs?success=Proof submitted successfully. Admin will review shortly.')
}
