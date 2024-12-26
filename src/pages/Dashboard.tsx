import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { CompletedOrdersTable } from "@/components/dashboard/CompletedOrdersTable";
import { Button } from "@/components/ui/button";
import { OrderDetailsDialog } from "@/components/dashboard/OrderDetailsDialog";
import { OrderSearch } from "@/components/dashboard/search/OrderSearch";
import { Order } from "@/integrations/supabase/types/orders";
import { BarChart3 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedCompletedOrder, setSelectedCompletedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const { data: orders, isLoading } = useQuery({
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

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
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/analytics')} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>

        <OrderSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={statusFilter}
          onFilterChange={setStatusFilter}
        />

        {isLoading ? (
          <p>Loading orders...</p>
        ) : (
          <div className="space-y-8">
            <OrdersTable 
              orders={orders || []} 
              isAdmin={true}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
            <CompletedOrdersTable 
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