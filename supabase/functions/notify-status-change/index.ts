import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StatusChangePayload {
  orderId: string;
  oldStatus: string;
  newStatus: string;
  userId: string;
}

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

const getStatusEmailContent = (status: string, eventName: string) => {
  switch (status) {
    case 'in_progress':
      return {
        subject: `Order for ${eventName} is now in progress`,
        html: `<p>Great news! Your order for ${eventName} is now being worked on by our design team.</p>
               <p>We'll notify you when the preview is ready for your review.</p>`
      };
    case 'preview_ready':
      return {
        subject: `Preview ready for ${eventName}`,
        html: `<p>The preview for your ${eventName} order is now ready for review!</p>
               <p>Please log in to your dashboard to check it out and provide feedback.</p>`
      };
    case 'completed':
      return {
        subject: `Order completed for ${eventName}`,
        html: `<p>Your order for ${eventName} has been completed!</p>
               <p>You can now download your files from your dashboard.</p>`
      };
    default:
      return {
        subject: `Order status updated for ${eventName}`,
        html: `<p>The status of your order for ${eventName} has been updated to ${status}.</p>
               <p>Check your dashboard for more details.</p>`
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Notify status change function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: StatusChangePayload = await req.json();
    console.log("Received payload:", payload);

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('event_name, profiles(email, name)')
      .eq('id', payload.orderId)
      .single();

    if (orderError) {
      console.error("Error fetching order:", orderError);
      throw new Error(`Failed to fetch order: ${orderError.message}`);
    }

    if (!order?.profiles?.email) {
      console.error("No email found for user");
      throw new Error("User email not found");
    }

    const { subject, html } = getStatusEmailContent(payload.newStatus, order.event_name);

    // Send email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Custom Photo Booth Templates <orders@customphotoboothtemplates.com>",
        to: [order.profiles.email],
        subject,
        html,
      }),
    });

    if (!emailRes.ok) {
      const error = await emailRes.text();
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const emailData = await emailRes.json();
    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in notify-status-change function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);