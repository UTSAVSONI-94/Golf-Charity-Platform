'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function allocateCharity(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const charityId = formData.get('charityId') as string
  const percentage = parseInt(formData.get('percentage') as string || '0', 10)

  if (!charityId || percentage < 10 || percentage > 100) {
    redirect('/dashboard/charity?error=Invalid allocation parameters.')
  }

  const { error } = await supabase.auth.updateUser({
    data: { 
      charity_id: charityId,
      charity_percentage: percentage
    }
  })

  if (error) {
    redirect(`/dashboard/charity?error=${encodeURIComponent('Failed to update your charity preferences securely. ' + error.message)}`)
  }

  redirect('/dashboard/charity?success=True')
}
