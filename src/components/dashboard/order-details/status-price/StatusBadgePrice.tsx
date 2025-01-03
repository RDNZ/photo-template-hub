import { Badge } from "@/components/ui/badge";
import { formatPrice } from "../../utils/tableFormatters";

interface StatusBadgePriceProps {
  status: string;
  price: number;
}

export const StatusBadgePrice = ({ status, price }: StatusBadgePriceProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-brand-teal hover:bg-brand-teal/90';
      case 'in_progress':
        return 'bg-brand-orange hover:bg-brand-orange/90';
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

  return (
    <div className="flex items-center justify-between w-full">
      <Badge className={`${getStatusColor(status)} text-sm font-medium`}>
        {formatStatus(status)}
      </Badge>
      <span className="text-lg font-semibold text-brand-gray-dark">
        {formatPrice(price)}
      </span>
    </div>
  );
};