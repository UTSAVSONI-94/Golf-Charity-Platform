import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Golf Charity Platform
          </h1>
          <p className="text-neutral-400 mt-2">Sign in to manage your scores and subscriptions</p>
        </div>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1" htmlFor="email">Email</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
              className="w-full bg-neutral-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pt-4 space-y-3">
            <button 
              formAction={login} 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg px-4 py-2.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
            >
              Log in
            </button>
            <button 
              formAction={signup} 
              className="w-full bg-transparent hover:bg-white/5 border border-white/20 text-white font-semibold rounded-lg px-4 py-2.5 transition-all"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
