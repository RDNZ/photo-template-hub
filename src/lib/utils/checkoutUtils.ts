import { supabase } from "@/integrations/supabase/client";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

export const createCheckoutSession = async (
  values: OrderFormValues, 
  totalPrice: number, 
  email: string, 
  orderId: string
) => {
  console.log("Creating checkout session with params:", {
    price: totalPrice,
    email,
    event_name: values.event_name,
    order_id: orderId
  });

  if (!orderId) {
    throw new Error("Order ID is required for checkout");
  }

  // Get the current window location to construct proper URLs
  const baseUrl = window.location.origin;
  console.log("Base URL for checkout:", baseUrl);

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { 
      price: totalPrice,
      email,
      event_name: values.event_name,
      order_id: orderId,
      success_url: `${baseUrl}/client-dashboard?success=true&order_id=${orderId}`,
      cancel_url: `${baseUrl}/client-dashboard?canceled=true&order_id=${orderId}`
    }
  });

  if (error) {
    console.error("Checkout session creation failed:", {
      error,
      message: error.message,
      context: error.context
    });
    throw new Error(error.message || "Failed to create checkout session");
  }

  if (!data?.url) {
    console.error("No checkout URL in response:", data);
    throw new Error("Invalid checkout session response");
  }

  console.log("Checkout session created successfully, redirecting to:", data.url);
  return data.url;
};