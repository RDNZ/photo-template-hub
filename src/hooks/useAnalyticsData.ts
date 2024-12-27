import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAnalyticsData = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      console.log("Fetching analytics data");
      
      // Get total orders
      const { data: totalOrders, error: totalError } = await supabase
        .from("orders")
        .select("count");

      if (totalError) {
        console.error("Error fetching total orders:", totalError);
        throw totalError;
      }

      // Get completed orders
      const { data: completedOrders, error: completedError } = await supabase
        .from("orders")
        .select("count")
        .eq("status", "completed");

      if (completedError) {
        console.error("Error fetching completed orders:", completedError);
        throw completedError;
      }

      // Get monthly orders
      const { data: monthlyOrders, error: monthlyError } = await supabase
        .from("orders")
        .select("created_at, price")
        .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .order("created_at");

      if (monthlyError) {
        console.error("Error fetching monthly orders:", monthlyError);
        throw monthlyError;
      }

      // Get revenue data
      const { data: revenue, error: revenueError } = await supabase
        .from("orders")
        .select("price, created_at, status")
        .eq("status", "completed");

      if (revenueError) {
        console.error("Error fetching revenue:", revenueError);
        throw revenueError;
      }

      const totalCount = totalOrders[0]?.count || 0;
      const completedCount = completedOrders[0]?.count || 0;
      
      // Calculate completion rate, ensure it's a valid number
      const completionRate = totalCount > 0 
        ? Math.round((completedCount / totalCount) * 100) 
        : 0;

      console.log("Analytics calculations:", {
        totalCount,
        completedCount,
        completionRate
      });

      // Calculate revenue
      const totalRevenue = revenue.reduce((sum, order) => sum + (order.price || 0), 0);
      const currentMonthRevenue = revenue
        .filter(order => {
          const orderDate = new Date(order.created_at);
          const now = new Date();
          return orderDate.getMonth() === now.getMonth() && 
                 orderDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, order) => sum + (order.price || 0), 0);

      // Prepare monthly data
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
        orders: 0
      }));

      monthlyOrders.forEach(order => {
        const month = new Date(order.created_at).getMonth();
        monthlyData[month].orders++;
      });

      console.log("Returning analytics data:", {
        totalOrders: totalCount,
        completedOrders: completedCount,
        completionRate,
        monthlyData,
        totalRevenue,
        currentMonthRevenue
      });

      return {
        totalOrders: totalCount,
        completedOrders: completedCount,
        completionRate,
        monthlyData,
        totalRevenue,
        currentMonthRevenue
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};