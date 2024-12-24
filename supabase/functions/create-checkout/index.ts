import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log('Raw request data:', requestData);
    
    const { price, email, event_name } = requestData;
    console.log('Parsed request data:', { price, email, event_name });

    if (!price || !email) {
      const errorMsg = 'Missing required fields: price and email are required';
      console.error(errorMsg, { price, email });
      return new Response(
        JSON.stringify({ error: errorMsg }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      const errorMsg = 'Stripe secret key is not configured';
      console.error(errorMsg);
      return new Response(
        JSON.stringify({ error: errorMsg }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    console.log('Initializing Stripe...');
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    console.log('Creating payment session with params:', {
      email,
      price,
      event_name,
      origin: req.headers.get('origin')
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Photo Template Order - ${event_name || 'Custom Design'}`,
            },
            unit_amount: price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${req.headers.get('origin')}/client-dashboard?success=true`,
      cancel_url: `${req.headers.get('origin')}/client-dashboard?canceled=true`,
    });

    console.log('Payment session created successfully:', { sessionId: session.id });
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Detailed error in create-checkout:', error);
    return new Response(
      JSON.stringify({ 
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          details: error
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});