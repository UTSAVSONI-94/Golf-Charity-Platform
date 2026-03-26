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
  const { data: entries, error: entriesError } = await supabase
    .from('user_draw_entries')
    .select('*')
    .eq('draw_id', drawId)
    
  if (entriesError) throw new Error("Failed to fetch entries")

  const winnersTier1: string[] = [] // 5 matches
  const winnersTier2: string[] = [] // 4 matches
  const winnersTier3: string[] = [] // 3 matches

  // Determine matches for each entry
  for (const entry of entries || []) {
    const matchCount = calculateMatchCount(entry.user_numbers, draw.draw_numbers)
    
    // Update match_count on entry
    await supabase.from('user_draw_entries').update({ match_count: matchCount }).eq('id', entry.id)
    
    if (matchCount === 5) winnersTier1.push(entry.user_id)
    if (matchCount === 4) winnersTier2.push(entry.user_id)
    if (matchCount === 3) winnersTier3.push(entry.user_id)
  }

  // Calculate payouts based on pool splits
  const payoutTier1 = totalPrizePool * 0.40
  const payoutTier2 = totalPrizePool * 0.35
  const payoutTier3 = totalPrizePool * 0.25

  const inserts: Database['public']['Tables']['winners']['Insert'][] = []

  // Split equally among winners in each tier
  if (winnersTier1.length > 0) {
    const split = payoutTier1 / winnersTier1.length
    winnersTier1.forEach(uid => inserts.push({ user_id: uid, draw_id: drawId, match_type: 5, prize_amount: split, status: 'pending' }))
  }
  // If no tier 1 winners, the 40% simply rolls over to the next month's pool manually

  if (winnersTier2.length > 0) {
    const split = payoutTier2 / winnersTier2.length
    winnersTier2.forEach(uid => inserts.push({ user_id: uid, draw_id: drawId, match_type: 4, prize_amount: split, status: 'pending' }))
  }

  if (winnersTier3.length > 0) {
    const split = payoutTier3 / winnersTier3.length
    winnersTier3.forEach(uid => inserts.push({ user_id: uid, draw_id: drawId, match_type: 3, prize_amount: split, status: 'pending' }))
  }

  // Insert payouts if any exist
  if (inserts.length > 0) {
    const { error: insertError } = await supabase.from('winners').insert(inserts)
    if (insertError) console.error("Error inserting winners", insertError)
  }

  // Finally mark draw as published
  await supabase.from('draws').update({ status: 'published' }).eq('id', drawId)
  
  return {
    tier1: winnersTier1.length,
    tier2: winnersTier2.length,
    tier3: winnersTier3.length,
    payouts: inserts
  }
}
