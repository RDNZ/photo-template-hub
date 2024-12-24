import { toast } from "@/components/ui/use-toast";
import { deleteOrder } from "./orderUtils";

export const handleCheckoutError = async (error: unknown, orderId?: string) => {
  console.error('Detailed checkout error:', {
    error,
    message: error instanceof Error ? error.message : 'Unknown error',
    orderId
  });

  // If we have an orderId, attempt to clean up the pending order
  if (orderId) {
    try {
      await deleteOrder(orderId);
      console.log('Successfully deleted pending order:', orderId);
    } catch (deleteError) {
      console.error('Failed to delete pending order:', deleteError);
    }
  }

  // Provide a more specific error message based on the error type
  let errorMessage = "An unexpected error occurred during checkout";
  
  if (error instanceof Error) {
    if (error.message.includes('insert into "orders"')) {
      errorMessage = "Failed to create order. Please check your order details and try again.";
    } else if (error.message.includes('stripe')) {
      errorMessage = "Payment processing error. Please try again.";
    } else {
      errorMessage = `Error: ${error.message}`;
    }
  }

  toast({
    title: "Checkout Error",
    description: errorMessage,
    variant: "destructive",
  });
};