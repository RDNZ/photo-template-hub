import { Badge } from "@/components/ui/badge";

interface StatusBadgePriceProps {
  status: string;
  price: number;
}

export const StatusBadgePrice = ({ status, price }: StatusBadgePriceProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'in_progress':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'preview_ready':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'in_revision':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((price || 0) / 100);

  return (
    <div className="flex items-center justify-between">
      <Badge className={`${getStatusColor(status)}`}>
        {formatStatus(status)}
      </Badge>
      <span className="font-semibold">{formattedPrice}</span>
    </div>
  );
};