'use server'

import { createClient } from '@/utils/supabase/server'
import Stripe from 'stripe'
import { redirect } from 'next/navigation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any
})

export async function createCheckoutSession(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?error=You must create an account before subscribing.')
  }

  const planName = formData.get('planName') as string
  const isYearly = formData.get('isYearly') === 'true'

  if (!planName) return

  // Ad-hoc line item generation mapping to our UI prices
  const unitAmount = planName === 'Premium' 
    ? (isYearly ? 24999 : 2499) 
    : (isYearly ? 9999 : 999)

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `ImpactPlay ${planName} Plan`,
              description: 'Access to algorithmic draws, charity allocations, and automated legacy tracking.',
            },
            unit_amount: unitAmount,
            recurring: {
              interval: isYearly ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/settings?success=Subscription_Active`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/subscribe`,
      client_reference_id: user.id,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id
        }
      }
    })

    if (session.url) {
      redirect(session.url)
    }
  } catch (err: any) {
    // CRITICAL: Next.js redirect() throws a NEXT_REDIRECT error internally.
    // We must re-throw it or the redirect gets swallowed by our catch block.
    if (err?.digest?.startsWith('NEXT_REDIRECT')) {
      throw err
    }
    const message = err?.message || 'Unknown Stripe error'
    console.error('Stripe Checkout Error:', message)
    redirect(`/subscribe?error=${encodeURIComponent(message)}`)
  }
}
