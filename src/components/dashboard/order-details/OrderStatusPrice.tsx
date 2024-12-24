import { Badge } from "@/components/ui/badge";

interface OrderStatusPriceProps {
  status: string;
  price: number;
}

export const OrderStatusPrice = ({ status, price }: OrderStatusPriceProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "submitted":
        return "default";
      case "in_progress":
        return "secondary";
      case "preview_ready":
        return "outline";
      case "completed":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="flex justify-between items-center pt-4">
      <div>
        <span className="text-muted-foreground mr-2">Status:</span>
        <Badge variant={getStatusBadgeVariant(status)}>
          {status.replace(/_/g, ' ')}
        </Badge>
      </div>
      <div>
        <span className="text-muted-foreground mr-2">Price:</span>
        <span className="font-semibold">{formatPrice(price)}</span>
      </div>
    </div>
  );
};