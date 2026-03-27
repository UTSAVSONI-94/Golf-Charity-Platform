import { createClient } from '@/utils/supabase/server'
import { Database } from '@/types/supabase'

export function calculateMatchCount(userNumbers: number[], drawNumbers: number[]): number {
  return userNumbers.filter(n => drawNumbers.includes(n)).length
}

export async function processDrawWinnings(drawId: string, totalPrizePool: number) {
  const supabase = await createClient()
  
  // Fetch the draw
  const { data: draw, error: drawError } = await supabase
    .from('draws')
    .select('*')
    .eq('id', drawId)
    .single()
    
  if (drawError || !draw) throw new Error("Draw not found")

  // Fetch all entries for this draw
  const { data: entries, error: entriesError } = await (supabase as any)
    .from('user_draw_entries')
    .select('*')
    .eq('draw_id', drawId)
    
  if (entriesError) throw new Error("Failed to fetch entries")

  const winnersTier1: { uid: string, amount: number }[] = [] // 5 matches
  const winnersTier2: { uid: string, amount: number }[] = [] // 4 matches
  const winnersTier3: { uid: string, amount: number }[] = [] // 3 matches

  // Calculate payouts based on pool splits
  const payoutTier1 = totalPrizePool * 0.40
  const payoutTier2 = totalPrizePool * 0.35
  const payoutTier3 = totalPrizePool * 0.25

  let rolloverAmount = 0;

  // Track valid entries (>= 5 scores requirement)
  const validEntries = []
  
  for (const entry of entries || []) {
    // Edge case limit: Less than 5 scores logic -> Check if user has < 5 scores linked over the month
    // Assuming entry.user_numbers has length 5 if they qualify
    if (!entry.user_numbers || entry.user_numbers.length < 5) continue
    
    validEntries.push(entry)
  }

  // Determine matches for each entry
  for (const entry of validEntries) {
    const matchCount = calculateMatchCount(entry.user_numbers, draw.draw_numbers)
    
    // Update match_count on entry
    await (supabase as any).from('user_draw_entries').update({ match_count: matchCount }).eq('id', entry.id)
    
    // We will push to tier arrays to calculate split later
    if (matchCount === 5) winnersTier1.push({ uid: entry.user_id, amount: 0 })
    if (matchCount === 4) winnersTier2.push({ uid: entry.user_id, amount: 0 })
    if (matchCount === 3) winnersTier3.push({ uid: entry.user_id, amount: 0 })
  }

  const inserts: any[] = []

  // Split equally among winners in each tier
  if (winnersTier1.length > 0) {
    const split = payoutTier1 / winnersTier1.length
    winnersTier1.forEach(w => { w.amount = split; inserts.push({ user_id: w.uid, draw_id: drawId, match_type: 5, prize_amount: split, status: 'pending' }) })
  } else {
    // Edge Case: No 5-match winner -> jackpot rollover
    rolloverAmount += payoutTier1
  }

  if (winnersTier2.length > 0) {
    const split = payoutTier2 / winnersTier2.length
    winnersTier2.forEach(w => { w.amount = split; inserts.push({ user_id: w.uid, draw_id: drawId, match_type: 4, prize_amount: split, status: 'pending' }) })
  } else {
    rolloverAmount += payoutTier2
  }

  if (winnersTier3.length > 0) {
    const split = payoutTier3 / winnersTier3.length
    winnersTier3.forEach(w => { w.amount = split; inserts.push({ user_id: w.uid, draw_id: drawId, match_type: 3, prize_amount: split, status: 'pending' }) })
  } else {
    rolloverAmount += payoutTier3
  }

  // Insert payouts if any exist
  if (inserts.length > 0) {
    const { error: insertError } = await (supabase as any).from('winners').insert(inserts)
    if (insertError) console.error("Error inserting winners", insertError)
  }

  // Handle Rollover logging (Usually inserted into a rollover table or added to next month's pool)
  if (rolloverAmount > 0) {
    await (supabase as any).from('jackpot_rollover').insert({
      draw_id: drawId,
      amount: rolloverAmount
    })
  }

  // Finally mark draw as published
  await supabase.from('draws').update({ status: 'published' }).eq('id', drawId)
  
  // Trigger Draw Result Emails
  const allWinners = [...winnersTier1, ...winnersTier2, ...winnersTier3]
  const { sendDrawResultsEmail } = await import('@/lib/email')

  for (const winner of allWinners) {
    const { data: userData } = await supabase.auth.admin.getUserById(winner.uid)
    if (userData.user?.email) {
      await sendDrawResultsEmail(userData.user.email, true, winner.amount)
    }
  }
  
  return {
    tier1: winnersTier1.length,
    tier2: winnersTier2.length,
    tier3: winnersTier3.length,
    rollover: rolloverAmount,
    payouts: inserts
  }
}
