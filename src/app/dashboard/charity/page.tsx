import { Heart, Save, CheckCircle, AlertCircle } from 'lucide-react'
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
  const percentage = metadata.charity_percentage || 15
  const selectedCharity = metadata.charity_id || '1'
  
  const charities = [
    { id: '1', name: "Global Clean Water Initiative" },
    { id: '2', name: "Youth Sports Foundation" },
    { id: '3', name: "Wildlife Conservation Fund" }
  ]

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold mb-2">Charity Allocation</h1>
        <p className="text-neutral-400">You must allocate a minimum of 10% of your subscription fee to charity. Feel free to increase it to give back even more!</p>
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
          <p className="text-sm font-medium">Your philanthropic impact profile has been securely updated.</p>
        </div>
      )}

      <form action={allocateCharity} className="glass rounded-3xl p-8 space-y-8">
        <div>
          <label className="block text-lg font-bold text-white mb-4">Select a Charity</label>
          <div className="space-y-3">
            {charities.map(c => (
              <label key={c.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedCharity === c.id ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-neutral-900/50 border-white/10 hover:border-white/20'}`}>
                <input 
                  type="radio" 
                  name="charityId" 
                  value={c.id} 
                  defaultChecked={selectedCharity === c.id}
                  className="w-5 h-5 text-emerald-500 focus:ring-emerald-500 bg-transparent border-white/20"
                />
                <span className="font-medium text-lg">{c.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-lg font-bold text-white">Donation Percentage</label>
            <span className="text-2xl font-black text-emerald-400">Impact Ratio</span>
          </div>
          <p className="text-sm text-neutral-400 mb-6">Drag the slider to adjust your contribution. (Min 10%)</p>
          
          <input 
            type="range" 
            name="percentage"
            min="10" 
            max="100" 
            step="5"
            defaultValue={percentage}
            className="w-full h-3 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            onInput={(e) => {
               // Update a sibling span text purely in native HTML using simple JS to mimic React state bindings across strict server bounds
               const el = e.target as HTMLInputElement;
               const display = el.nextElementSibling as HTMLDivElement;
               if (display && display.id === "pct-display") display.innerText = el.value + "%";
            }}
          />
          <div id="pct-display" className="text-center font-bold text-emerald-500 mt-2">{percentage}%</div>
          <div className="flex justify-between text-xs text-neutral-500 mt-2 font-medium">
            <span>10% (Minimum)</span>
            <span>50%</span>
            <span>100% (Everything)</span>
          </div>
        </div>

        <button type="submit" className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Save className="w-5 h-5" /> Secure Allocation
        </button>
      </form>
    </div>
  )
}
