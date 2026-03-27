import { login, signup } from './actions'

// In Next.js App Router, page components can safely be async when reading search params
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = await searchParams;
  const errorMsg = resolvedParams.error;

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* SaaS Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-md w-full backdrop-blur-xl bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-neutral-100">
            Impact<span className="text-blue-400">Play</span>
          </h1>
          <p className="text-neutral-400 mt-2">Sign in to manage your entries and impact</p>
        </div>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <p className="text-sm text-red-400 font-medium">{errorMsg}</p>
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="password">Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pt-4 space-y-3">
            <button 
              formAction={login} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-4 py-3 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              Log in
            </button>
            <button 
              formAction={signup} 
              className="w-full bg-transparent hover:bg-white/5 border border-white/20 text-white font-semibold rounded-xl px-4 py-3 transition-all"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
