import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenueCardProps {
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export const RevenueCard = ({ monthlyRevenue, yearlyRevenue }: RevenueCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold">{formatCurrency(monthlyRevenue)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Year</p>
          <p className="text-2xl font-bold">{formatCurrency(yearlyRevenue)}</p>
        </div>
      </CardContent>
    </Card>
  );
};