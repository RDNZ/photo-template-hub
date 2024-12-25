import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/integrations/supabase/types/orders";
import { formatPrice, formatTurnaroundTime, getStatusBadgeVariant } from "../utils/tableFormatters";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface OrderTableRowProps {
  order: Order;
  onClick: () => void;
  isAdmin?: boolean;
}

export const OrderTableRow = ({ order, onClick, isAdmin = false }: OrderTableRowProps) => {
  const queryClient = useQueryClient();

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (error) throw error;

      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50" 
      onClick={(e) => {
        // Prevent row click when clicking on status select
        if ((e.target as HTMLElement).closest('.status-select')) {
          e.stopPropagation();
          return;
        }
        onClick();
      }}
    >
      {isAdmin && (
        <>
          <TableCell className="border-r border-muted/30">{order.profiles?.name || 'Unknown'}</TableCell>
          <TableCell className="border-r border-muted/30">{order.profiles?.email || 'Unknown'}</TableCell>
        </>
      )}
      <TableCell className="border-r border-muted/30">{order.event_name}</TableCell>
      <TableCell className="border-r border-muted/30">{order.software_type.replace(/_/g, ' ')}</TableCell>
      <TableCell className="border-r border-muted/30">{order.dimensions}</TableCell>
      <TableCell className="border-r border-muted/30">{order.photo_boxes}</TableCell>
      <TableCell className="border-r border-muted/30">{order.darkroom_file ? 'Yes' : 'No'}</TableCell>
      <TableCell className="border-r border-muted/30">{formatTurnaroundTime(order.turnaround_time)}</TableCell>
      <TableCell className="border-r border-muted/30 max-w-[200px] truncate" title={order.details || ''}>
        {order.details || '-'}
      </TableCell>
      <TableCell className="border-r border-muted/30">{formatPrice(order.price)}</TableCell>
      <TableCell>
        {isAdmin ? (
          <div className="status-select" onClick={(e) => e.stopPropagation()}>
            <Select
              defaultValue={order.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="preview_ready">Preview Ready</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <Badge variant={getStatusBadgeVariant(order.status)}>
            {order.status.replace(/_/g, ' ')}
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
};