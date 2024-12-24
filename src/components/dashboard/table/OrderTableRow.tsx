import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/integrations/supabase/types/orders";
import { formatPrice, formatTurnaroundTime, getStatusBadgeVariant } from "../utils/tableFormatters";

interface OrderTableRowProps {
  order: Order;
  onClick: () => void;
}

export const OrderTableRow = ({ order, onClick }: OrderTableRowProps) => (
  <TableRow className="cursor-pointer hover:bg-muted/50" onClick={onClick}>
    <TableCell className="bg-muted/20">{order.event_name}</TableCell>
    <TableCell>{order.software_type.replace(/_/g, ' ')}</TableCell>
    <TableCell className="bg-muted/20">{order.dimensions}</TableCell>
    <TableCell>{order.photo_boxes}</TableCell>
    <TableCell className="bg-muted/20">{order.darkroom_file ? 'Yes' : 'No'}</TableCell>
    <TableCell>{formatTurnaroundTime(order.turnaround_time)}</TableCell>
    <TableCell className="bg-muted/20 max-w-[200px] truncate" title={order.details || ''}>
      {order.details || '-'}
    </TableCell>
    <TableCell>{formatPrice(order.price)}</TableCell>
    <TableCell className="bg-muted/20">
      <Badge variant={getStatusBadgeVariant(order.status)}>
        {order.status.replace(/_/g, ' ')}
      </Badge>
    </TableCell>
  </TableRow>
);