import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SuccessHandlerProps {
  onSuccess: () => void;
}

export const SuccessHandler = ({ onSuccess }: SuccessHandlerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      console.log("Payment successful, refetching orders");
      onSuccess();
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been created and payment processed.",
      });
      navigate('/client-dashboard', { replace: true });
    }
  }, [searchParams, toast, navigate, onSuccess]);

  return null;
};