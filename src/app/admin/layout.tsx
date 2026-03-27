import { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Users, Heart, Gift, ShieldCheck, Activity } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// Add your admin email(s) here
const ADMIN_EMAILS = ['utsavsonimrj@gmail.com']

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Block: not logged in
  if (!user) redirect('/login')

  // Block: not an admin
  if (!ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/dashboard')
  }
  const menu = [
    { label: "Overview", icon: Activity, href: "/admin" },
    { label: "Users & Subs", icon: Users, href: "/admin/users" },
    { label: "Draw Management", icon: Gift, href: "/admin/draws" },
    { label: "Charities", icon: Heart, href: "/admin/charities" },
    { label: "Verify Payouts", icon: ShieldCheck, href: "/admin/payouts" },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] pt-24 px-6 max-w-[90rem] mx-auto flex flex-col md:flex-row gap-8">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="glass border-emerald-500/30 rounded-3xl p-6 sticky top-28 bg-emerald-950/10">
          <div className="flex items-center gap-2 mb-6 px-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          </div>
          <nav className="space-y-2">
            {menu.map(item => (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-500/20 text-emerald-100/70 hover:text-emerald-300 transition-all font-medium"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
