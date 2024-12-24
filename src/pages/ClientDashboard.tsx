import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ClientDashboard = () => {
  const navigate = useNavigate();

  // Check if user is authenticated and is a client
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      // Check if user is a client
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
    };

    checkAuth();
  }, [navigate]);

  // Fetch user's orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ["clientOrders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }

      return data;
    },
  });

  const handleNewOrder = () => {
    navigate("/new-order");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Button onClick={handleNewOrder}>New Order</Button>
        </div>

        {isLoading ? (
          <p>Loading orders...</p>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Software Type</TableHead>
                  <TableHead>Turnaround Time</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.event_name}</TableCell>
                      <TableCell>{order.software_type}</TableCell>
                      <TableCell>{order.turnaround_time}</TableCell>
                      <TableCell>{formatPrice(order.price)}</TableCell>
                      <TableCell className="capitalize">{order.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No orders found. Create your first order!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;