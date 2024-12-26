import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/dashboard/LoadingSpinner";
import { OrdersChart } from "@/components/analytics/OrdersChart";
import { CompletionRateCard } from "@/components/analytics/CompletionRateCard";
import { RevenueCard } from "@/components/analytics/RevenueCard";
import { RefreshCw } from "lucide-react";

const Analytics = () => {
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session found");
        navigate("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        console.log("User is not an admin");
        navigate("/dashboard");
      }
    };

    checkAdmin();
  }, [navigate]);

  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      console.log("Fetching analytics data");
      const { data: totalOrders, error: totalError } = await supabase
        .from("orders")
        .select("count");

      if (totalError) throw totalError;

      const { data: completedOrders, error: completedError } = await supabase
        .from("orders")
        .select("count")
        .eq("status", "completed");

      if (completedError) throw completedError;

      const { data: monthlyOrders, error: monthlyError } = await supabase
        .from("orders")
        .select("created_at, price")
        .gte("created_at", new Date(new Date().getFullYear(), 0, 1).toISOString())
        .order("created_at");

      if (monthlyError) throw monthlyError;

      const { data: revenue, error: revenueError } = await supabase
        .from("orders")
        .select("price")
        .eq("status", "completed");

      if (revenueError) throw revenueError;

      // Calculate total revenue
      const totalRevenue = revenue.reduce((sum, order) => sum + (order.price || 0), 0);

      // Calculate current month revenue
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentMonthRevenue = revenue
        .filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.getMonth() === currentMonth && 
                 orderDate.getFullYear() === currentYear;
        })
        .reduce((sum, order) => sum + (order.price || 0), 0);

      // Process monthly orders
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
        orders: 0
      }));

      monthlyOrders.forEach(order => {
        const month = new Date(order.created_at).getMonth();
        monthlyData[month].orders++;
      });

      return {
        totalOrders: totalOrders[0].count,
        completedOrders: completedOrders[0].count,
        monthlyData,
        totalRevenue,
        currentMonthRevenue
      };
    }
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  const completionRate = analytics ? 
    Math.round((analytics.completedOrders / analytics.totalOrders) * 100) : 0;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{analytics?.totalOrders || 0}</p>
            </CardContent>
          </Card>

          <CompletionRateCard rate={completionRate} />
          <RevenueCard 
            monthlyRevenue={analytics?.currentMonthRevenue || 0}
            yearlyRevenue={analytics?.totalRevenue || 0}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Orders Per Month</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersChart data={analytics?.monthlyData || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;