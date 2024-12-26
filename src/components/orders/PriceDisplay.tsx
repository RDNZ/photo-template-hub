import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface PriceDisplayProps {
  price: number;
  className?: string;
}

export const PriceDisplay = ({ price, className }: PriceDisplayProps) => {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Total Price:</span>
        <span className="text-lg font-bold">${price}</span>
      </div>
    </Card>
  );
};