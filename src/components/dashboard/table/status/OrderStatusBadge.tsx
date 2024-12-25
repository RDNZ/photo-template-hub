import { Badge } from "@/components/ui/badge";
import { getStatusBadgeVariant } from "../../utils/tableFormatters";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
};