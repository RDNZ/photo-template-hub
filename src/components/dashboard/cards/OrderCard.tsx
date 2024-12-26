import { Order } from "@/integrations/supabase/types/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eye, Upload, Copy } from "lucide-react";
import { OrderStatusSelect } from "../table/status/OrderStatusSelect";
import { PreviewUploadButton } from "../table/preview/PreviewUploadButton";
import { formatPrice, formatTurnaroundTime } from "../utils/tableFormatters";

interface OrderCardProps {
  order: Order;
  onClick: () => void;
  onReuseOrder?: () => void;
  isAdmin?: boolean;
  showReuse?: boolean;
}

export const OrderCard = ({ 
  order, 
  onClick, 
  onReuseOrder,
  isAdmin = false,
  showReuse = false 
}: OrderCardProps) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'status-badge-submitted';
      case 'in_progress':
        return 'status-badge-in-progress';
      case 'preview_ready':
        return 'status-badge-preview-ready';
      case 'completed':
        return 'status-badge-completed';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="dashboard-card animate-fade-in">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-1 text-brand-gray-dark" title={order.event_name}>
              {order.event_name}
            </h3>
            {isAdmin && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{order.profiles?.name || 'Unknown'}</p>
                <p>{order.profiles?.email || 'Unknown'}</p>
              </div>
            )}
          </div>
          {isAdmin ? (
            <div className="status-select">
              <OrderStatusSelect 
                orderId={order.id} 
                currentStatus={order.status} 
              />
            </div>
          ) : (
            <Badge className={`status-badge ${getStatusClass(order.status)}`}>
              {order.status.replace(/_/g, ' ')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">Software:</span>
            <p className="font-medium text-brand-gray-dark">{order.software_type.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Dimensions:</span>
            <p className="font-medium text-brand-gray-dark">{order.dimensions}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Photo Boxes:</span>
            <p className="font-medium text-brand-gray-dark">{order.photo_boxes}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Darkroom File:</span>
            <p className="font-medium text-brand-gray-dark">{order.darkroom_file ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Turnaround:</span>
            <p className="font-medium text-brand-gray-dark">{formatTurnaroundTime(order.turnaround_time)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Price:</span>
            <p className="font-medium text-brand-gray-dark">{formatPrice(order.price)}</p>
          </div>
        </div>
        {order.details && (
          <div className="text-sm">
            <span className="text-muted-foreground">Details:</span>
            <p className="line-clamp-2 font-medium mt-1 text-brand-gray-dark" title={order.details}>
              {order.details}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onClick}
          className="flex-1 dashboard-button dashboard-button-accent"
        >
          <Eye className="h-4 w-4 text-white" />
          View Details
        </Button>
        {isAdmin && order.status === 'in_progress' && (
          <div className="preview-upload flex-1">
            <PreviewUploadButton orderId={order.id} />
          </div>
        )}
        {showReuse && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReuseOrder}
            className="flex-1 reuse-button dashboard-button-secondary"
          >
            <Copy className="h-4 w-4 text-brand-teal" />
            Reuse
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};