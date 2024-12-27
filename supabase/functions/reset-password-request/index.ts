import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Password reset request received");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if RESEND_API_KEY is set
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      throw new Error("Missing RESEND_API_KEY");
    }
    console.log("RESEND_API_KEY is configured");

    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { email } = await req.json();
    console.log("Processing reset request for email:", email);

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Look up user by email
    const { data: user, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      console.error("Error fetching users:", userError);
      throw userError;
    }

    const matchedUser = user.users.find((u) => u.email === email);
    if (!matchedUser) {
      console.log("No user found with this email");
      // Return success even if user not found for security
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    console.log("User found, generating reset token");

    // Generate reset token
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Insert reset record
    const { error: insertError } = await supabase
      .from("password_resets")
      .insert({
        user_id: matchedUser.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Error inserting reset record:", insertError);
      throw insertError;
    }
    console.log("Reset record created successfully");

    // Construct reset link
    const resetLink = `${req.headers.get("origin")}/reset-password?token=${token}`;
    console.log("Reset link generated:", resetLink);

    // Send email via Resend
    console.log("Attempting to send email via Resend...");
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Custom Photo Booth Templates <orders@customphotoboothtemplates.com>",
        to: [email],
        subject: "Reset Your Password",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a1a1a;">Reset Your Password</h1>
            <p style="color: #4a4a4a;">We received a request to reset your password. Click the button below to choose a new password:</p>
            <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 24px 0;">Reset Password</a>
            <p style="color: #4a4a4a;">This link will expire in 1 hour.</p>
            <p style="color: #4a4a4a;">If you didn't request this password reset, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const error = await emailResponse.text();
      console.error("Error sending email:", error);
      throw new Error("Failed to send reset email");
    }
    console.log("Reset email sent successfully via Resend");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in reset-password-request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);