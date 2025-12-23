import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Validate CPF format (Brazilian tax ID)
function isValidCPF(cpf: string): boolean {
  if (!cpf) return false

  // Remove non-numeric characters
  const cleanCpf = cpf.replace(/\D/g, '')

  // CPF must have 11 digits
  if (cleanCpf.length !== 11) return false

  // Check for all same digits
  if (/^(\d)\1{10}$/.test(cleanCpf)) return false

  // Validate check digits
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCpf[i]) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf[9])) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCpf[i]) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCpf[10])) return false

  return true
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16',
    })

    const { amount, booking_id, customer_email, customer_name, customer_tax_id } = await req.json()

    // Validate required fields
    if (!amount || amount <= 0) {
      throw new Error('Amount must be a positive number')
    }

    if (!customer_email) {
      throw new Error('Customer email is required for PIX payments')
    }

    if (!customer_name) {
      throw new Error('Customer name is required for PIX payments')
    }

    // Validate CPF if provided (optional but recommended for PIX)
    if (customer_tax_id && !isValidCPF(customer_tax_id)) {
      throw new Error('Invalid CPF format')
    }

    // Create payment intent with PIX
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'brl',
      payment_method_types: ['pix'],
      metadata: {
        booking_id: booking_id || '',
        customer_tax_id: customer_tax_id || '',
      },
      receipt_email: customer_email,
    })

    // Confirm with PIX to get QR code
    const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method_data: {
        type: 'pix',
        billing_details: {
          name: customer_name,
          email: customer_email,
        },
      },
    })

    // Get PIX details from next_action
    const pixDetails = confirmedIntent.next_action?.pix_display_qr_code

    if (!pixDetails) {
      throw new Error('Failed to generate PIX QR code')
    }

    return new Response(
      JSON.stringify({
        paymentIntentId: confirmedIntent.id,
        pixQrCode: pixDetails.data || '',
        pixQrCodeBase64: pixDetails.image_url_png || '',
        expiresAt: pixDetails.expires_at ? new Date(pixDetails.expires_at * 1000).toISOString() : '',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating PIX payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
