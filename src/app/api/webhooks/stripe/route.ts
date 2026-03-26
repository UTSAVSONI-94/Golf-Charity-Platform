import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

// Initialize Stripe (requires STRIPE_SECRET_KEY in env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const status = subscription.status
      
      // Determine plan type from interval
      const priceParams = subscription.items.data[0].price
      const planType = priceParams.recurring?.interval === 'year' ? 'yearly' : 'monthly'
      
      // Retrieve the supabase user id from customer metadata
      const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer
      const userId = customer.metadata?.supabase_user_id

      if (userId) {
        // Update DB Subscription Table
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
          console.error("DB Update Error", error)
        }
      }
      break
    }
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
