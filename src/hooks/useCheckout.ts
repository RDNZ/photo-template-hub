import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

export const useCheckout = () => {
  const handleCheckout = async (values: OrderFormValues, totalPrice: number) => {
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

      // First create the order with pending status
      console.log("Creating order in database...");
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
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
        toast({
          title: "Order Creation Error",
          description: "Failed to create order. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Order created successfully:", order);

      console.log("Creating checkout session with params:", {
        price: totalPrice,
        email: session.user.email,
        event_name: values.event_name,
        order_id: order.id
      });

      const response = await supabase.functions.invoke('create-checkout', {
        body: { 
          ...values, 
          price: totalPrice,
          email: session.user.email,
          order_id: order.id
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
        
        // If checkout fails, delete the pending order
        await supabase
          .from('orders')
          .delete()
          .eq('id', order.id);

        toast({
          title: "Checkout Error",
          description: response.error.message || "Failed to create checkout session",
          variant: "destructive",
        });
        return;
      }

      if (!response.data?.url) {
        console.error("No checkout URL in response:", response);
        
        // If no checkout URL, delete the pending order
        await supabase
          .from('orders')
          .delete()
          .eq('id', order.id);

        toast({
          title: "Checkout Error",
          description: "Failed to create checkout session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Redirect to Stripe Checkout
      console.log("Redirecting to Stripe checkout URL:", response.data.url);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Detailed checkout error:', error);
      toast({
        title: "Checkout Error",
        description: error instanceof Error 
          ? `Error: ${error.message}` 
          : "An unexpected error occurred during checkout",
        variant: "destructive",
      });
    }
  };

  return { handleCheckout };
};