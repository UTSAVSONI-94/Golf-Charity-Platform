'use server'

import { createClient } from '@/utils/supabase/server'
import { generateRandomDraw, generateAlgorithmicDraw } from '@/lib/draw-engine'
import { calculateMatchCount } from '@/lib/match-logic'
import { redirect } from 'next/navigation'

// ── SIMULATE DRAW ──────────────────────────────────────────────
// Generates 5 winning numbers without saving to DB (preview mode)
export async function simulateDraw(formData: FormData) {
  const mode = formData.get('mode') as 'random' | 'algorithmic'
  
  let numbers: number[]
  if (mode === 'algorithmic') {
    numbers = await generateAlgorithmicDraw()
  } else {
    numbers = await generateRandomDraw()
  }

  // Return via searchParams so the server component can display them
  const encoded = numbers.join(',')
  redirect(`/admin/draws?simulation=${encoded}&mode=${mode}`)
}

// ── PUBLISH DRAW ───────────────────────────────────────────────
// Saves draw to DB, computes matches for ALL users, splits prize pool, handles rollover
export async function publishDraw(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const numbersStr = formData.get('numbers') as string
  if (!numbersStr) redirect('/admin/draws?error=No draw numbers to publish.')

  const drawNumbers = numbersStr.split(',').map(Number)
  if (drawNumbers.length !== 5) redirect('/admin/draws?error=Draw must contain exactly 5 numbers.')

  // 1. Check for existing draw this month
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

  const { data: existingDraw } = await supabase
    .from('draws')
    .select('id')
    .gte('created_at', monthStart)
    .lte('created_at', monthEnd)
    .eq('status', 'published')
    .maybeSingle()

  if (existingDraw) {
    redirect('/admin/draws?error=A draw has already been published this month.')
  }

  // 2. Insert the draw record
  const { data: draw, error: drawError } = await supabase
    .from('draws')
    .insert({
      draw_numbers: drawNumbers,
      status: 'published',
      draw_type: formData.get('mode') as string || 'random',
    })
    .select()
    .single()

  if (drawError || !draw) {
    redirect(`/admin/draws?error=${encodeURIComponent('Failed to save draw: ' + (drawError?.message || 'Unknown'))}`)
  }

  // 3. Fetch ALL users who have exactly 5 scores (qualified users)
  const { data: allUsers } = await supabase
    .from('users')
    .select('id')

  let tier1Winners = 0, tier2Winners = 0, tier3Winners = 0
  let totalMatched = 0

  // 4. For each user, fetch their Rolling 5 scores and compute matches
  for (const u of allUsers || []) {
    const { data: userScores } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', u.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (!userScores || userScores.length < 5) continue // Must have exactly 5 to qualify

    const userNumbers = userScores.map(s => s.score)
    const matchCount = calculateMatchCount(userNumbers, drawNumbers)

    if (matchCount >= 3) {
      totalMatched++
      if (matchCount === 5) tier1Winners++
      if (matchCount === 4) tier2Winners++
      if (matchCount === 3) tier3Winners++
    }
  }

  // 5. Calculate prize pool from active subscriptions, accounting for charity splits
  const { data: activeSubs } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('status', 'active')

  const BASE_PRICE = 9.99
  let totalCharityContribution = 0
  let totalPrizeRevenue = 0

  // For each active subscriber, deduct their charity % before adding to prize pool
  for (const sub of activeSubs || []) {
    const { data: { user: subUser } } = await supabase.auth.admin.getUserById(sub.user_id)
    const charityPct = subUser?.user_metadata?.charity_percentage || 10 // Default 10% minimum
    const charityAmount = BASE_PRICE * (charityPct / 100)
    const prizeAmount = BASE_PRICE - charityAmount

    totalCharityContribution += charityAmount
    totalPrizeRevenue += prizeAmount
  }

  // Prize pool = revenue after charity deductions, split for draws
  const totalPool = totalPrizeRevenue * 0.50 // 50% of post-charity revenue goes to prize pool

  // Check for rollover from previous months
  const { data: rollovers } = await (supabase as any)
    .from('jackpot_rollover')
    .select('amount')

  const rolloverTotal = (rollovers || []).reduce((sum: number, r: any) => sum + (r.amount || 0), 0)
  const grandPool = totalPool + rolloverTotal

  // 6. Calculate tier splits
  const pool1 = grandPool * 0.40 // Tier 1: 5 matches
  const pool2 = grandPool * 0.35 // Tier 2: 4 matches
  const pool3 = grandPool * 0.25 // Tier 3: 3 matches

  let rolloverAmount = 0
  if (tier1Winners === 0) rolloverAmount += pool1
  if (tier2Winners === 0) rolloverAmount += pool2
  if (tier3Winners === 0) rolloverAmount += pool3

  // 7. Save rollover if any tier had 0 winners
  if (rolloverAmount > 0) {
    await (supabase as any).from('jackpot_rollover').insert({
      draw_id: draw.id,
      amount: rolloverAmount
    })
  }

  // 8. Clear old rollovers that were consumed
  if (rolloverTotal > 0) {
    await (supabase as any).from('jackpot_rollover').delete().neq('draw_id', draw.id)
  }

  const resultStr = `Published! T1(5match):${tier1Winners} T2(4match):${tier2Winners} T3(3match):${tier3Winners} | Prize Pool:$${grandPool.toFixed(2)} | Charity Total:$${totalCharityContribution.toFixed(2)} | Rollover:$${rolloverAmount.toFixed(2)}`
  redirect(`/admin/draws?success=${encodeURIComponent(resultStr)}`)
}
