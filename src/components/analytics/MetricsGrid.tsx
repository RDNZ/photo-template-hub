import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompletionRateCard } from "./CompletionRateCard";
import { RevenueCard } from "./RevenueCard";

interface MetricsGridProps {
  totalOrders: number;
  completionRate: number;
  monthlyRevenue: number;
  totalRevenue: number;
}

export const MetricsGrid = ({ 
  totalOrders, 
  completionRate, 
  monthlyRevenue, 
  totalRevenue 
}: MetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalOrders}</p>
        </CardContent>
      </Card>
      <CompletionRateCard rate={completionRate} />
      <RevenueCard 
        monthlyRevenue={monthlyRevenue}
        yearlyRevenue={totalRevenue}
      />
    </div>
  );
};