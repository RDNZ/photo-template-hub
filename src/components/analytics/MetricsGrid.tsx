import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompletionRateCard } from "./CompletionRateCard";
import { RevenueCard } from "./RevenueCard";
import { ShoppingCart, CheckCircle, DollarSign } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <Card className="bg-blue-50/50 dark:bg-blue-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-green-50/50 dark:bg-green-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold">{completionRate}</p>
            <span className="text-xl">%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-purple-50/50 dark:bg-purple-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};