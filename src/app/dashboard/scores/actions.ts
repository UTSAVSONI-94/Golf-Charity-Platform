'use server'

import { createClient } from '@/utils/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Strict schema: score must be integer 1-45, date must be YYYY-MM-DD and not in the future
const scoreSchema = z.object({
  score: z.number().int().min(1, 'Score must be at least 1').max(45, 'Score cannot exceed 45'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)')
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
    redirect('/dashboard/scores?error=Invalid input. Score must be an integer between 1 and 45.')
  }

  const { score, date } = parsed.data

  // Block future dates
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  if (new Date(date) > today) {
    redirect('/dashboard/scores?error=Cannot submit scores for future dates.')
  }

  // Block duplicate dates for the same user
  const { data: existing } = await supabase
    .from('scores')
    .select('id')
    .match({ user_id: user.id, date })
    .maybeSingle()

  if (existing) {
    redirect('/dashboard/scores?error=You have already submitted a score for this date.')
  }

  // Insert the new score
  const { error } = await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      score,
      date
    })

  if (error) {
    redirect('/dashboard/scores?error=Failed to save score. Please try again.')
  }

  // ── ROLLING 5 ENFORCEMENT ──
  // After insert, fetch ALL scores for this user ordered newest-first.
  // If more than 5 exist, bulk-delete everything after the 5th.
  const { data: allScores } = await supabase
    .from('scores')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (allScores && allScores.length > 5) {
    const scoresToDelete = allScores.slice(5).map(s => s.id)
    await supabase.from('scores').delete().in('id', scoresToDelete)
  }

  revalidatePath('/dashboard/scores')
  redirect('/dashboard/scores')
}

export async function deleteScore(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const scoreId = formData.get('scoreId') as string
  if (!scoreId) {
    redirect('/dashboard/scores?error=Missing score ID.')
  }

  // Security: only allow deleting your own scores
  const { data: score } = await supabase
    .from('scores')
    .select('user_id')
    .eq('id', scoreId)
    .single()

  if (!score || score.user_id !== user.id) {
    redirect('/dashboard/scores?error=Unauthorized. You can only delete your own scores.')
  }

  await supabase.from('scores').delete().eq('id', scoreId)

  revalidatePath('/dashboard/scores')
  redirect('/dashboard/scores')
}
