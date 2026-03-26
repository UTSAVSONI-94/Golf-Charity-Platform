import { createClient } from '@/utils/supabase/server'

export async function generateRandomDraw(): Promise<number[]> {
  const numbers = new Set<number>()
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1)
  }
  return Array.from(numbers).sort((a, b) => a - b)
}

export async function generateAlgorithmicDraw(): Promise<number[]> {
  const supabase = await createClient()
  
  // Fetch recent scores to find most frequent
  const { data: scores, error } = await supabase
    .from('scores')
    .select('score')
    .order('created_at', { ascending: false })
    .limit(1000)

  if (error || !scores || scores.length === 0) {
    // Fallback to random if no scores available
    return generateRandomDraw()
  }

  const frequencies: Record<number, number> = {}
  scores.forEach(({ score }) => {
    frequencies[score] = (frequencies[score] || 0) + 1
  })

  // Sort by frequency descending and pick top 5
  const sortedNumbers = Object.entries(frequencies)
    .sort((a, b) => b[1] - a[1])
    .map(entry => parseInt(entry[0], 10))

  // If we don't have 5 unique numbers in recent scores, fill remainder with random
  const drawSet = new Set<number>(sortedNumbers.slice(0, 5))
  while (drawSet.size < 5) {
    drawSet.add(Math.floor(Math.random() * 45) + 1)
  }

  return Array.from(drawSet).sort((a, b) => a - b)
}
