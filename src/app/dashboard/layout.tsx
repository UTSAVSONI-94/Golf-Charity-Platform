import { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Shield, Heart, Gift, Upload, Settings, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single()

  const isActive = sub?.status === 'active'

  const menu = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard", restricted: false },
    { label: "My Entries", icon: Shield, href: "/dashboard/scores", restricted: true },
    { label: "Charity Split", icon: Heart, href: "/dashboard/charity", restricted: true },
    { label: "Draws & Winnings", icon: Gift, href: "/dashboard/winnings", restricted: false },
    { label: "Proof Upload", icon: Upload, href: "/dashboard/proofs", restricted: true },
    { label: "Settings", icon: Settings, href: "/dashboard/settings", restricted: false },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] pt-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="glass rounded-3xl p-6 sticky top-28 border border-neutral-800 bg-neutral-900/50">
          <h2 className="text-xl font-bold mb-6 text-white px-2">Dashboard</h2>
          
          {!isActive && (
            <div className="mb-6 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Active subscription required to access all features.</p>
            </div>
          )}

          <nav className="space-y-2">
            {menu.map(item => {
              const isDisabled = item.restricted && !isActive
              return (
                <Link 
                  key={item.href} 
                  href={isDisabled ? '/subscribe' : item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isDisabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent text-neutral-500' : 'hover:bg-white/10 text-neutral-300 hover:text-white'}`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isDisabled && <span className="ml-auto text-[10px] uppercase tracking-wider bg-neutral-800 px-2 py-0.5 rounded">Pro</span>}
                </Link>
              )
            })}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-neutral-800">
            <form action={async () => {
              'use server'
              const { logout } = await import('@/app/login/actions')
              await logout()
            }}>
              <button 
                type="submit"
                className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-all font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Log out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>
    </div>
  )
}
