import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order } from "@/integrations/supabase/types/orders";
import { formatPrice, formatTurnaroundTime } from "../utils/tableFormatters";
import { OrderStatusSelect } from "./status/OrderStatusSelect";
import { PreviewUploadButton } from "./preview/PreviewUploadButton";
import { OrderStatusBadge } from "./status/OrderStatusBadge";
import { Copy } from "lucide-react";

interface OrderTableRowProps {
  order: Order;
  onClick: () => void;
  onReuseOrder?: () => void;
  isAdmin?: boolean;
  showReuse?: boolean;
}

export const OrderTableRow = ({ 
  order, 
  onClick, 
  onReuseOrder,
  isAdmin = false,
  showReuse = false
}: OrderTableRowProps) => {
  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50" 
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.status-select, .preview-upload, .reuse-button')) {
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
          <div className="flex items-center gap-2">
            <div className="status-select">
              <OrderStatusSelect 
                orderId={order.id} 
                currentStatus={order.status} 
              />
            </div>
            {order.status === 'in_progress' && (
              <PreviewUploadButton orderId={order.id} />
            )}
          </div>
        ) : (
          <OrderStatusBadge status={order.status} />
        )}
      </TableCell>
      {showReuse && (
        <TableCell>
          <Button
            variant="ghost"
            size="sm"
            className="reuse-button"
            onClick={onReuseOrder}
          >
            <Copy className="h-4 w-4 mr-2" />
            Reuse
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};