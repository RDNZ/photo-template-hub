import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SuccessHandlerProps {
  onSuccess: () => void;
}

export const SuccessHandler = ({ onSuccess }: SuccessHandlerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const orderId = searchParams.get('order_id');

    const handleSuccess = async () => {
      if (success === 'true' && orderId) {
        console.log("Payment successful, updating order status for order:", orderId);
        
        const { error } = await supabase
          .from('orders')
          .update({ status: 'submitted' })
          .eq('id', orderId);

        if (error) {
          console.error("Error updating order status:", error);
          toast({
            title: "Error",
            description: "There was an error updating your order status.",
            variant: "destructive",
          });
          return;
        }

        console.log("Order status updated successfully");
        onSuccess();
        toast({
          title: "Order Placed Successfully",
          description: "Your order has been created and payment processed.",
        });
        navigate('/client-dashboard', { replace: true });
      }
    };

    handleSuccess();
  }, [searchParams, toast, navigate, onSuccess]);

  return null;
};