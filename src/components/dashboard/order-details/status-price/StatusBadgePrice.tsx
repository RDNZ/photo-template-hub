import { Badge } from "@/components/ui/badge";

interface StatusBadgePriceProps {
  status: string;
  price: number;
}

export const StatusBadgePrice = ({ status, price }: StatusBadgePriceProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'preview_ready':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'in_revision':
        return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format price directly without division since it's already in dollars
  return (
    <div className="flex items-center justify-between">
      <Badge className={`${getStatusColor(status)}`}>
        {formatStatus(status)}
      </Badge>
      <span className="font-semibold">${price.toFixed(2)}</span>
    </div>
  );
};