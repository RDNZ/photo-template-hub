import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export const OrderStatusSelect = ({ orderId, currentStatus }: OrderStatusSelectProps) => {
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    console.log(`Attempting to update order ${orderId} status from ${currentStatus} to ${newStatus}`);

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error("Error updating order status:", {
          orderId,
          currentStatus,
          newStatus,
          error
        });
        throw error;
      }

      toast({
        title: "Status Updated",
        description: `Order status has been updated to ${newStatus}`,
      });
    } catch (error: any) {
      console.error("Error updating order status:", {
        orderId,
        currentStatus,
        newStatus,
        error: error.message,
        details: error
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