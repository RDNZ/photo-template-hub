import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

const createOrder = async (values: OrderFormValues, totalPrice: number, userId: string) => {
  console.log("Creating order in database...");
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      event_name: values.event_name,
      software_type: values.software_type,
      dimensions: values.dimensions,
      turnaround_time: values.turnaround_time,
      price: totalPrice,
      status: 'pending',
      details: values.details,
      photo_boxes: values.photo_boxes,
      darkroom_file: values.darkroom_file,
      reference_images: values.reference_images
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw new Error("Failed to create order");
  }

  console.log("Order created successfully:", order);
  return order;
};

const createCheckoutSession = async (values: OrderFormValues, totalPrice: number, email: string, orderId: string) => {
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

const handleCheckoutError = async (error: unknown, orderId?: string) => {
  console.error('Detailed checkout error:', error);

  // If we have an order ID, delete the pending order
  if (orderId) {
    await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);
  }

  toast({
    title: "Checkout Error",
    description: error instanceof Error 
      ? `Error: ${error.message}` 
      : "An unexpected error occurred during checkout",
    variant: "destructive",
  });
};

export const useCheckout = () => {
  const handleCheckout = async (values: OrderFormValues, totalPrice: number) => {
    let orderId: string | undefined;

    try {
      console.log("Starting checkout process with values:", values);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No session found");
        toast({
          title: "Authentication Error",
          description: "Please sign in to continue with the checkout",
          variant: "destructive",
        });
        return;
      }

      // Create the order
      const order = await createOrder(values, totalPrice, session.user.id);
      orderId = order.id;

      // Create checkout session and get URL
      const checkoutUrl = await createCheckoutSession(
        values,
        totalPrice,
        session.user.email!,
        order.id
      );

      // Redirect to Stripe Checkout
      console.log("Redirecting to Stripe checkout URL:", checkoutUrl);
      window.location.href = checkoutUrl;
    } catch (error) {
      await handleCheckoutError(error, orderId);
    }
  };

  return { handleCheckout };
};