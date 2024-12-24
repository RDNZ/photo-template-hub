import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

export const useCheckout = () => {
  const handleCheckout = async (values: OrderFormValues, totalPrice: number) => {
    try {
      console.log("Creating checkout session with values:", values);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Error",
          description: "Please sign in to continue with the checkout",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke('create-checkout', {
        body: { 
          ...values, 
          price: totalPrice,
          email: session.user.email 
        }
      });

      console.log("Checkout response:", response);

      if (response.error) {
        console.error("Checkout error:", response.error);
        toast({
          title: "Checkout Error",
          description: response.error.message || "Failed to create checkout session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!response.data?.url) {
        console.error("No checkout URL received");
        toast({
          title: "Checkout Error",
          description: "Failed to create checkout session. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
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