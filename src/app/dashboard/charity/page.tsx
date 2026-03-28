import { Heart, Save, CheckCircle, AlertCircle, DollarSign, TrendingUp } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { allocateCharity } from './actions'

export default async function CharitySplitPage({ searchParams }: { searchParams: Promise<{ error?: string, success?: string }> }) {
  const resolvedParams = await searchParams;
  const errorMsg = resolvedParams.error;
  const successMsg = resolvedParams.success;
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const metadata = user.user_metadata || {}
  const percentage = metadata.charity_percentage || 10
  const selectedCharity = metadata.charity_id || '1'

  // Fetch real charities from DB
  const { data: dbCharities } = await supabase.from('charities').select('*').order('featured', { ascending: false })

  // Fallback if no charities in DB yet
  const charities = dbCharities && dbCharities.length > 0
    ? dbCharities.map(c => ({ id: c.id, name: c.name, description: c.description }))
    : [
        { id: '1', name: "Global Clean Water Initiative", description: "Providing clean drinking water to underserved communities worldwide." },
        { id: '2', name: "Youth Sports Foundation", description: "Giving children access to sports programs and mentorship." },
        { id: '3', name: "Wildlife Conservation Fund", description: "Protecting endangered species and their natural habitats." }
      ]

  // Calculate real dollar impact based on subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_type')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  const BASE_PRICE = subscription?.plan_type === 'yearly' ? (249.99 / 12) : 9.99
  const charityAmount = (BASE_PRICE * (percentage / 100))
  const prizeAmount = BASE_PRICE - charityAmount

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2">Charity Allocation</h1>
        <p className="text-neutral-400">You must allocate a minimum of 10% of your subscription fee to charity. Increase it to amplify your social impact!</p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Your charity allocation has been securely updated.</p>
        </div>
      )}

      {/* Impact Breakdown Card */}
      {subscription && (
        <div className="glass rounded-3xl p-6 border border-emerald-500/20 bg-emerald-950/10">
          <h2 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Your Monthly Impact Breakdown
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-white">${BASE_PRICE.toFixed(2)}</p>
              <p className="text-xs text-neutral-400 mt-1">Subscription</p>
            </div>
            <div className="bg-emerald-500/10 rounded-2xl p-4 text-center border border-emerald-500/20">
              <p className="text-2xl font-black text-emerald-400">${charityAmount.toFixed(2)}</p>
              <p className="text-xs text-emerald-300/60 mt-1">→ Charity ({percentage}%)</p>
            </div>
            <div className="bg-blue-500/10 rounded-2xl p-4 text-center border border-blue-500/20">
              <p className="text-2xl font-black text-blue-400">${prizeAmount.toFixed(2)}</p>
              <p className="text-xs text-blue-300/60 mt-1">→ Prize Pool</p>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3 text-center">
            ${(charityAmount * 12).toFixed(2)}/year going directly to your chosen charity
          </p>
        </div>
      )}

      <form action={allocateCharity} className="glass rounded-3xl p-8 space-y-8">
        <div>
          <label className="block text-lg font-bold text-white mb-4">Select a Charity</label>
          <div className="space-y-3">
            {charities.map(c => (
              <label key={c.id} className={`flex flex-col gap-1 p-4 rounded-xl border cursor-pointer transition-all ${selectedCharity === c.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-neutral-900/50 border-white/10 hover:border-white/20'}`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="radio" 
                    name="charityId" 
                    value={c.id} 
                    defaultChecked={selectedCharity === c.id}
                    className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 bg-transparent border-white/20"
                  />
                  <span className="font-semibold text-lg">{c.name}</span>
                </div>
                {c.description && (
                  <p className="text-sm text-neutral-400 ml-9">{c.description}</p>
                )}
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-lg font-bold text-white">Donation Percentage</label>
            <span className="text-2xl font-black text-emerald-400">{percentage}%</span>
          </div>
          <p className="text-sm text-neutral-400 mb-6">Drag the slider to adjust your contribution. Minimum 10% enforced.</p>
          
          <input 
            type="range" 
            name="percentage"
            min="10" 
            max="100" 
            step="5"
            defaultValue={percentage}
            className="w-full h-3 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
          />
          <div className="flex justify-between text-xs text-neutral-500 mt-2 font-medium">
            <span>10% (Minimum)</span>
            <span>50%</span>
            <span>100% (Full Giving)</span>
          </div>
        </div>

        <button type="submit" className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Save className="w-5 h-5" /> Save Allocation
        </button>
      </form>
    </div>
  )
}
