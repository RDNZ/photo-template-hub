import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { OrderFormValues } from "@/lib/schemas/orderSchema";
import { createOrder } from "@/lib/utils/orderUtils";
import { createCheckoutSession } from "@/lib/utils/checkoutUtils";
import { handleCheckoutError } from "@/lib/utils/errorUtils";

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