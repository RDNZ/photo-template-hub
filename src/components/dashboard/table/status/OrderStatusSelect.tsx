import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    console.log(`Updating order ${orderId} status from ${currentStatus} to ${newStatus}`);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error("Error updating order status:", error);
        throw error;
      }

      // Invalidate queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      await queryClient.invalidateQueries({ queryKey: ['clientOrders'] });

      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus.replace(/_/g, ' ')}`,
      });
    } catch (error: any) {
      console.error("Failed to update order status:", error);
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
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
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