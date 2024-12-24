import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  className?: string;
}

export const PriceDisplay = ({ price, className }: PriceDisplayProps) => {
  return (
    <div className={cn("mt-6 rounded-lg bg-gray-50 px-4 py-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Total Price:</span>
        <span className="text-lg font-bold">${price}</span>
      </div>
    </div>
  );
};