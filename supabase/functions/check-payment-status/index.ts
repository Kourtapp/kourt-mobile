import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16',
    })

    const { paymentIntentId } = await req.json()

    if (!paymentIntentId) {
      throw new Error('Payment Intent ID is required')
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Map Stripe status to our simplified status
    let status: 'succeeded' | 'processing' | 'requires_payment_method' | 'canceled'
    switch (paymentIntent.status) {
      case 'succeeded':
        status = 'succeeded'
        break
      case 'processing':
        status = 'processing'
        break
      case 'canceled':
        status = 'canceled'
        break
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
      default:
        status = 'requires_payment_method'
        break
    }

    return new Response(
      JSON.stringify({
        status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error checking payment status:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
