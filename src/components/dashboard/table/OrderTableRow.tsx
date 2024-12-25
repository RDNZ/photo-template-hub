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
      <Badge variant={getStatusBadgeVariant(order.status)}>
        {order.status.replace(/_/g, ' ')}
      </Badge>
    </TableCell>
  </TableRow>
);