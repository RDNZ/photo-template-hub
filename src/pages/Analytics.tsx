import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/dashboard/LoadingSpinner";
import { OrdersChart } from "@/components/analytics/OrdersChart";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { MetricsGrid } from "@/components/analytics/MetricsGrid";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const Analytics = () => {
  const navigate = useNavigate();

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

  const { data: analytics, isLoading, refetch } = useAnalyticsData();

  if (isLoading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  const completionRate = analytics ? 
    Math.round((analytics.completedOrders / analytics.totalOrders) * 100) : 0;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <AnalyticsHeader onRefresh={refetch} />
        
        <MetricsGrid 
          totalOrders={analytics?.totalOrders || 0}
          completionRate={completionRate}
          monthlyRevenue={analytics?.currentMonthRevenue || 0}
          totalRevenue={analytics?.totalRevenue || 0}
        />

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