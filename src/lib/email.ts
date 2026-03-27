import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

export async function sendWelcomeEmail(email: string) {
  return resend.emails.send({
    from: 'ImpactPlay <hello@impactplay.charity>',
    to: email,
    subject: 'Welcome to ImpactPlay!',
    html: '<h1>Welcome to ImpactPlay</h1><p>Thank you for joining our purpose-driven competitor community.</p>'
  })
}

export async function sendSubscriptionSuccessEmail(email: string, planType: string) {
  return resend.emails.send({
    from: 'ImpactPlay <hello@impactplay.charity>',
    to: email,
    subject: 'Subscription Activated - ImpactPlay',
    html: `<h1>Subscription Active</h1><p>Thank you for subscribing to the ${planType} plan. You are now fueling our algorithmic impact pool!</p>`
  })
}

export async function sendDrawResultsEmail(email: string, isWinner: boolean, prizeAmount?: number) {
  const subject = isWinner ? 'Congratulations! You Won the Impact Draw!' : 'Impact Draw Results'
  const html = isWinner 
    ? `<h1>You Won!</h1><p>Congratulations, your entries matched the jackpot! You won $${prizeAmount}.</p>` 
    : `<h1>Draw Results</h1><p>The latest draw has concluded. Unfortunately, you didn't win this time, but your entries helped fund verified charities.</p>`

  return resend.emails.send({
    from: 'ImpactPlay <hello@impactplay.charity>',
    to: email,
    subject,
    html
  })
}
