import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAnalyticsData = () => {
  return useQuery({
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
        .select("price, created_at")
        .eq("status", "completed");

      if (revenueError) throw revenueError;

      const totalRevenue = revenue.reduce((sum, order) => sum + (order.price || 0), 0);

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentMonthRevenue = revenue
        .filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.getMonth() === currentMonth && 
                 orderDate.getFullYear() === currentYear;
        })
        .reduce((sum, order) => sum + (order.price || 0), 0);

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
};