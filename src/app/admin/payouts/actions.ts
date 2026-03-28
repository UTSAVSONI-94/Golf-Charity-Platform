'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// Admin approves a user's proof submission
export async function approveProof(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('userId') as string
  if (!userId) redirect('/admin/payouts?error=Missing user ID')

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { proof_status: 'approved' }
  })

  if (error) {
    redirect(`/admin/payouts?error=${encodeURIComponent('Failed to approve: ' + error.message)}`)
  }

  redirect('/admin/payouts?success=Proof approved successfully.')
}

// Admin rejects a user's proof with feedback
export async function rejectProof(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('userId') as string
  const feedback = formData.get('feedback') as string || 'Proof did not meet requirements. Please resubmit.'

  if (!userId) redirect('/admin/payouts?error=Missing user ID')

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      proof_status: 'rejected',
      proof_submitted: false,
      admin_feedback: feedback
    }
  })

  if (error) {
    redirect(`/admin/payouts?error=${encodeURIComponent('Failed to reject: ' + error.message)}`)
  }

  redirect('/admin/payouts?success=Proof rejected. User has been notified to resubmit.')
}

// Admin marks payout as complete
export async function markPaid(formData: FormData) {
  const supabase = await createClient()
  const userId = formData.get('userId') as string
  if (!userId) redirect('/admin/payouts?error=Missing user ID')

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { proof_status: 'paid' }
  })

  if (error) {
    redirect(`/admin/payouts?error=${encodeURIComponent('Failed to mark paid: ' + error.message)}`)
  }

  redirect('/admin/payouts?success=Payout marked as complete.')
}
