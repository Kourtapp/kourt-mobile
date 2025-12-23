import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { email, name, userId } = await req.json()

    if (!email) {
      throw new Error('Email is required')
    }

    // Check if customer already exists in Stripe
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    })

    let customerId: string

    if (existingCustomers.data.length > 0) {
      // Customer exists, return their ID
      customerId = existingCustomers.data[0].id

      // Update customer info if name provided
      if (name) {
        await stripe.customers.update(customerId, { name })
      }
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name: name || undefined,
        metadata: {
          supabase_user_id: userId || '',
        },
      })
      customerId = customer.id
    }

    // Optionally store the Stripe customer ID in Supabase profiles
    if (userId) {
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId)
    }

    return new Response(
      JSON.stringify({
        customerId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error getting or creating customer:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
