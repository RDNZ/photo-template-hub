import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { CompletedOrdersTable } from "@/components/dashboard/CompletedOrdersTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderDetailsDialog } from "@/components/dashboard/OrderDetailsDialog";
import { Order } from "@/integrations/supabase/types/orders";

const Dashboard = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCompletedOrder, setSelectedCompletedOrder] = useState(null);

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

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

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
    // Store order details in localStorage for the new order form
    const orderToReuse = {
      event_name: order.event_name,
      software_type: order.software_type,
      dimensions: order.dimensions,
      turnaround_time: order.turnaround_time,
      details: order.details,
      photo_boxes: order.photo_boxes,
      darkroomFile: order.darkroom_file,
      price: order.price
    };
    localStorage.setItem('reuseOrder', JSON.stringify(orderToReuse));
    navigate('/new-order');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Filter by Status</label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="preview_ready">Preview Ready</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p>Loading orders...</p>
        ) : (
          <div className="space-y-8">
            <OrdersTable orders={orders || []} isAdmin={true} />
            <CompletedOrdersTable 
              orders={orders || []} 
              onOrderClick={setSelectedCompletedOrder}
              onReuseOrder={handleReuseOrder}
              isAdmin={true} 
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