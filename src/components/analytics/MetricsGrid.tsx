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
      <Card className="bg-brand-gray-light/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-brand-gray-dark">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-brand-teal" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-brand-gray-dark">{totalOrders}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-brand-gray-light/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-brand-gray-dark">Completion Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-brand-teal" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-brand-gray-dark">{completionRate}</p>
            <span className="text-xl text-brand-gray-dark">%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-brand-gray-light/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-brand-gray-dark">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-brand-teal" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold text-brand-gray-dark">${monthlyRevenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-brand-gray-dark">${totalRevenue.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};