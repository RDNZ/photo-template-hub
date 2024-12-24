import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/dashboard/LoadingSpinner";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorState } from "@/components/dashboard/ErrorState";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch user profile. Please try again.",
          });
          navigate("/");
          return;
        }

        if (!profile) {
          console.log("No profile found");
          navigate("/");
          return;
        }

        if (profile.role === 'admin') {
          console.log("Admin user detected, redirecting to admin dashboard");
          navigate("/dashboard");
          return;
        }

        if (profile.role !== "client") {
          console.log("User is not a client");
          navigate("/");
          return;
        }

        console.log("Client access confirmed");
        setIsAuthChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try logging in again.",
        });
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ["clientOrders"],
    queryFn: async () => {
      console.log("Fetching orders for client");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session");

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      console.log("Orders fetched:", data);
      return data;
    },
    enabled: !isAuthChecking,
  });

  const handleNewOrder = () => {
    navigate("/new-order");
  };

  if (isAuthChecking) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader onNewOrder={handleNewOrder} />
        {isLoading ? (
          <LoadingSpinner message="Loading orders..." />
        ) : (
          <OrdersTable orders={orders || []} />
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;