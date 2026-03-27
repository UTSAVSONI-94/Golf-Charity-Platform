'use server'

import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'
import { redirect } from 'next/navigation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any
})

export async function createCustomerPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .single()

  if (!subscription?.stripe_subscription_id) {
    redirect('/dashboard/settings?error=No active stripe transaction found.')
  }

  try {
    // 1. Fetch the subscription object deeply from Stripe securely utilizing our Secret Key
    const stripeSub = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
    
    // 2. Map the customer ID to officially generate an isolated, secure Billing Portal session where they can edit, upgrade, or cancel their card details autonomously.
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeSub.customer as string,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/settings`,
    })

    redirect(session.url)
  } catch (error) {
    console.error("Portal Error", error)
    redirect(`/dashboard/settings?error=${encodeURIComponent('Failed to securely connect to the billing matrix. Check your Stripe Secret configuration.')}`)
  }
}
