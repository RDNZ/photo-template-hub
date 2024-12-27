import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export const OrderStatusSelect = ({ orderId, currentStatus }: OrderStatusSelectProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    console.log(`Attempting to update order ${orderId} status from ${currentStatus} to ${newStatus}`);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Error updating order status:', {
          orderId,
          currentStatus,
          newStatus,
          error: error.message,
          details: error
        });
        
        toast({
          variant: "destructive",
          title: "Failed to update order status",
          description: `Error: ${error.message}. Please try again or contact support if the issue persists.`,
        });
        throw error;
      }

      if (!data) {
        throw new Error('No data returned after update');
      }

      console.log('Order status updated successfully:', {
        orderId,
        oldStatus: currentStatus,
        newStatus: data.status
      });

      // Invalidate queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      await queryClient.invalidateQueries({ queryKey: ['analytics'] });
      
      toast({
        title: "Status updated",
        description: `Order status changed to ${newStatus.replace(/_/g, ' ')}`,
      });
    } catch (error: any) {
      console.error('Unexpected error in handleStatusChange:', {
        orderId,
        currentStatus,
        newStatus,
        error: error.message,
        stack: error.stack
      });
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status. Please try again.",
      });
    }
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleStatusChange}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="submitted">Submitted</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="preview_ready">Preview Ready</SelectItem>
        <SelectItem value="in_revision">In Revision</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
};