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

  const response = await supabase.functions.invoke('create-checkout', {
    body: { 
      ...values, 
      price: totalPrice,
      email,
      order_id: orderId
    }
  });

  console.log("Checkout response:", response);

  if (response.error) {
    console.error("Checkout error details:", {
      error: response.error,
      message: response.error.message,
      name: response.error.name,
      context: response.error.context
    });
    throw new Error(response.error.message || "Failed to create checkout session");
  }

  if (!response.data?.url) {
    console.error("No checkout URL in response:", response);
    throw new Error("Failed to create checkout session");
  }

  return response.data.url;
};