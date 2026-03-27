'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Strict schema to securely handle invalid inputs gracefully
const scoreSchema = z.object({
  score: z.number().int().min(1).max(45),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
})

export async function addScore(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const parsed = scoreSchema.safeParse({
    score: Number(formData.get('score')),
    date: formData.get('date'),
  })

  if (!parsed.success) {
    redirect('/dashboard/scores?error=Invalid input. Score must be between 1 and 45.')
  }

  const { score, date } = parsed.data

  const { data: existing } = await supabase
    .from('scores')
    .select('id')
    .match({ user_id: user.id, date })
    .maybeSingle()

  if (existing) {
    redirect('/dashboard/scores?error=You have exactly already submitted a score for this particular date.')
  }

  const { error } = await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      score,
      date
    })

  if (error) {
    redirect('/dashboard/scores?error=Failed to save entry dynamically.')
  }

  // Enforce "Rolling 5" Logic
  const { data: allScores } = await supabase
    .from('scores')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (allScores && allScores.length > 5) {
    const scoresToDelete = allScores.slice(5).map(s => s.id)
    await supabase.from('scores').delete().in('id', scoresToDelete)
  }

  redirect('/dashboard/scores')
}

export async function deleteScore(formData: FormData) {
  const supabase = await createClient()
  const scoreId = formData.get('scoreId') as string
  
  if (scoreId) {
    await supabase.from('scores').delete().eq('id', scoreId)
  }
  
  redirect('/dashboard/scores')
}
