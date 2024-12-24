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

      console.log("Creating checkout session with params:", {
        price: totalPrice,
        email: session.user.email,
        event_name: values.event_name
      });

      const response = await supabase.functions.invoke('create-checkout', {
        body: { 
          ...values, 
          price: totalPrice,
          email: session.user.email 
        }
      });

      console.log("Checkout response:", response);

      if (response.error) {
        console.error("Checkout error details:", {
          error: response.error,
          status: response.status,
          statusText: response.statusText
        });
        toast({
          title: "Checkout Error",
          description: response.error.message || "Failed to create checkout session",
          variant: "destructive",
        });
        return;
      }

      if (!response.data?.url) {
        console.error("No checkout URL in response:", response);
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