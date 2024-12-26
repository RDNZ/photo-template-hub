import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrderDetailsDialog } from "@/components/dashboard/OrderDetailsDialog";
import { Order } from "@/integrations/supabase/types/orders";
import { RefreshCw } from "lucide-react";
import { AdminDashboardHeader } from "@/components/dashboard/header/AdminDashboardHeader";
import { SearchCard } from "@/components/dashboard/search/SearchCard";
import { OrdersSection } from "@/components/dashboard/orders/OrdersSection";
import { CompletedOrdersSection } from "@/components/dashboard/orders/CompletedOrdersSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCompletedOrder, setSelectedCompletedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ["adminOrders", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      return data;
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
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

      if (!profile) {
        console.log("No profile found");
        navigate("/");
        return;
      }

      if (profile.role === 'client') {
        console.log("Client user detected, redirecting to client dashboard");
        navigate("/client-dashboard");
        return;
      }

      if (profile.role !== "admin") {
        console.log("User is not an admin");
        navigate("/");
        return;
      }

      console.log("Admin access confirmed");
    };

    checkAuth();
  }, [navigate]);

  const handleReuseOrder = (order: Order) => {
    console.log("Admin reusing order:", order);
    const orderToReuse = {
      event_name: order.event_name,
      software_type: order.software_type,
      dimensions: order.dimensions,
      turnaround_time: order.turnaround_time,
      details: order.details,
      photo_boxes: order.photo_boxes,
      darkroom_file: order.darkroom_file,
      price: order.price,
      email: order.profiles?.email
    };
    localStorage.setItem('reuseOrder', JSON.stringify(orderToReuse));
    navigate('/new-order');
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <AdminDashboardHeader onRefresh={refetch} />
        
        <SearchCard
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={statusFilter}
          onFilterChange={setStatusFilter}
        />

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin text-brand-teal" />
          </div>
        ) : (
          <div className="space-y-6">
            <OrdersSection 
              title="Current Orders"
              orders={orders || []}
              isAdmin={true}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />

            <CompletedOrdersSection 
              orders={orders || []}
              onOrderClick={setSelectedCompletedOrder}
              onReuseOrder={handleReuseOrder}
              isAdmin={true}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          </div>
        )}

        <OrderDetailsDialog
          order={selectedCompletedOrder}
          isOpen={!!selectedCompletedOrder}
          onClose={() => setSelectedCompletedOrder(null)}
          isAdmin={true}
        />
      </div>
    </div>
  );
};

export default Dashboard;
