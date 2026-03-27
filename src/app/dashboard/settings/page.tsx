import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
      
      <div className="grid gap-8">
        {/* Profile Card */}
        <section className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
          <h2 className="text-xl font-semibold text-neutral-100 mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-neutral-400">Email Address</p>
              <p className="text-lg text-white font-mono mt-1">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">Account Verified</p>
              <p className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified
              </p>
            </div>
          </div>
        </section>

        {/* Subscription Card */}
        <section className="p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">Subscription Plan</h2>
              <p className="text-sm text-neutral-400 mb-4">Manage your ImpactPlay billing and plan tiers.</p>
              {subscription?.status === 'active' ? (
                <div className="flex flex-col gap-2">
                  <p className="text-lg text-white capitalize">{subscription.plan_type} Plan ✦</p>
                  <p className="text-sm text-neutral-500">
                    Renews on {new Date(subscription.end_date).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="text-neutral-300">You are currently on the Free tier. Upgrade to unlock the draw algorithm.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
