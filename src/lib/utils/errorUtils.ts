import { toast } from "@/components/ui/use-toast";
import { deleteOrder } from "./orderUtils";

export const handleCheckoutError = async (error: unknown, orderId?: string) => {
  console.error('Detailed checkout error:', error);

  if (orderId) {
    await deleteOrder(orderId);
  }

  toast({
    title: "Checkout Error",
    description: error instanceof Error 
      ? `Error: ${error.message}` 
      : "An unexpected error occurred during checkout",
    variant: "destructive",
  });
};