import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  if (!signature || !webhookSecret) {
    return new Response('Missing signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const bookingId = paymentIntent.metadata?.booking_id

        if (bookingId) {
          await supabase
            .from('bookings')
            .update({
              payment_status: 'succeeded',
              stripe_payment_intent_id: paymentIntent.id,
              status: 'confirmed',
            })
            .eq('id', bookingId)

          console.log(`Booking ${bookingId} payment confirmed`)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const bookingId = paymentIntent.metadata?.booking_id

        if (bookingId) {
          await supabase
            .from('bookings')
            .update({
              payment_status: 'failed',
              stripe_payment_intent_id: paymentIntent.id,
            })
            .eq('id', bookingId)

          console.log(`Booking ${bookingId} payment failed`)
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId = charge.payment_intent

        if (paymentIntentId) {
          await supabase
            .from('bookings')
            .update({
              payment_status: 'refunded',
              status: 'cancelled',
            })
            .eq('stripe_payment_intent_id', paymentIntentId)

          console.log(`Refund processed for payment intent ${paymentIntentId}`)
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
