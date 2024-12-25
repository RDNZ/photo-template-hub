import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useClientOrders = (isAuthChecking: boolean) => {
  return useQuery({
    queryKey: ["clientOrders"],
    queryFn: async () => {
      try {
        console.log("Starting to fetch orders for client");
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.error("No session found while fetching orders");
          throw new Error("No session");
        }

        console.log("Fetching orders for user ID:", session.user.id);
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            profiles:user_id (
              name,
              email
            )
          `)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
          throw error;
        }

        console.log("Orders fetched successfully:", data);
        return data;
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
    enabled: !isAuthChecking,
    refetchOnWindowFocus: true,
    staleTime: 1000,
  });
};