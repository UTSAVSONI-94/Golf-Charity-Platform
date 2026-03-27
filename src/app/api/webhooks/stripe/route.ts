import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

// Initialize Stripe (requires STRIPE_SECRET_KEY in env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {

    // ─── FIRST CHECKOUT ─────────────────────────────────────────
    // Fires when a user completes the Stripe Checkout for the first time.
    // We tag the Stripe Customer object with the Supabase user_id so all
    // future webhook events can look up the user.
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const supabaseUserId = session.client_reference_id // set during checkout creation
      const stripeCustomerId = session.customer as string

      if (supabaseUserId && stripeCustomerId) {
        // Permanently link this Stripe customer to this Supabase user
        await stripe.customers.update(stripeCustomerId, {
          metadata: { supabase_user_id: supabaseUserId }
        })
      }
      break
    }

    // ─── SUBSCRIPTION LIFECYCLE ─────────────────────────────────
    // Handles: new subscription, renewal, plan change, and cancellation.
    // Maps Stripe subscription status directly to our DB.
    //   'active'    → user has full access
    //   'past_due'  → payment failed but Stripe is retrying
    //   'canceled'  → user or admin canceled, access revoked
    //   'unpaid'    → all retries exhausted, access revoked
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any
      const status = subscription.status // 'active' | 'past_due' | 'canceled' | 'unpaid'

      // Determine monthly vs yearly from the price interval
      const priceParams = subscription.items?.data?.[0]?.price
      const planType = priceParams?.recurring?.interval === 'year' ? 'yearly' : 'monthly'

      // Look up which Supabase user owns this Stripe customer
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
      const userId = customer.metadata?.supabase_user_id

      if (userId) {
        // Upsert: insert if new, update if existing (keyed on stripe_subscription_id)
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            plan_type: planType,
            status: status,
            start_date: new Date(subscription.current_period_start * 1000).toISOString(),
            end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          }, { onConflict: 'stripe_subscription_id' })

        if (error) {
          console.error('DB upsert error:', error)
        }

        // Send lifecycle emails
        const { data: userData } = await supabase.auth.admin.getUserById(userId)
        const email = userData.user?.email

        if (email) {
          const { sendSubscriptionSuccessEmail } = await import('@/lib/email')

          if (status === 'active') {
            await sendSubscriptionSuccessEmail(email, planType)
          }
          // Future: add sendCancellationEmail, sendPaymentFailedEmail etc.
        }
      }
      break
    }

    // ─── PAYMENT FAILURE ────────────────────────────────────────
    // Fires when a renewal charge fails (card expired, insufficient funds).
    // We mark subscription as 'past_due' so the dashboard shows a warning.
    case 'invoice.payment_failed': {
      const invoice = event.data.object as any
      const stripeSubId = invoice.subscription as string

      if (stripeSubId) {
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', stripeSubId)

        if (error) console.error('Failed to mark past_due:', error)
      }
      break
    }

    // ─── SUCCESSFUL RENEWAL ─────────────────────────────────────
    // Fires when a recurring invoice is paid successfully.
    // We ensure the status stays 'active' and extend the period dates.
    case 'invoice.paid': {
      const invoice = event.data.object as any
      const stripeSubId = invoice.subscription as string

      if (stripeSubId) {
        // Fetch fresh subscription data from Stripe to get updated period
        const freshSub = await stripe.subscriptions.retrieve(stripeSubId) as any

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            start_date: new Date(freshSub.current_period_start * 1000).toISOString(),
            end_date: new Date(freshSub.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', stripeSubId)

        if (error) console.error('Failed to update renewal dates:', error)
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
