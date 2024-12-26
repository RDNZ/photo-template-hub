import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface PriceDisplayProps {
  price: number;
  className?: string;
}

export const PriceDisplay = ({ price, className }: PriceDisplayProps) => {
  return (
    <Card className={cn("p-6 border-brand-teal/20", className)}>
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium text-brand-gray-dark">Total Price:</span>
        <span className="text-2xl font-bold text-brand-teal">${price}</span>
      </div>
    </Card>
  );
};