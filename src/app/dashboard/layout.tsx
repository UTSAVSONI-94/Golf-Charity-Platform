import { ReactNode } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Trophy, Heart, Gift, Upload, Settings } from 'lucide-react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const menu = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "My Scores", icon: Trophy, href: "/dashboard/scores" },
    { label: "Charity Split", icon: Heart, href: "/dashboard/charity" },
    { label: "Draws & Winnings", icon: Gift, href: "/dashboard/winnings" },
    { label: "Proof Upload", icon: Upload, href: "/dashboard/proofs" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] pt-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="glass rounded-3xl p-6 sticky top-28">
          <h2 className="text-xl font-bold mb-6 text-white px-2">Dashboard</h2>
          <nav className="space-y-2">
            {menu.map(item => (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition-all font-medium"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>
    </div>
  )
}
