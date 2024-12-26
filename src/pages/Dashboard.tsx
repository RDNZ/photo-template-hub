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
import { BarChart3, RefreshCw, LogOut, ClipboardList, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <div className="min-h-screen p-4 sm:p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button 
              onClick={() => navigate('/analytics')} 
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
            <Button 
              onClick={handleSignOut} 
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage and track all orders here. You can filter by status or search by event name.
            </p>
            <OrderSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterStatus={statusFilter}
              onFilterChange={setStatusFilter}
            />
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            <Card className={cn(
              "bg-card",
              "transition-colors duration-200"
            )}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Current Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersTable 
                  orders={orders || []} 
                  isAdmin={true}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                />
              </CardContent>
            </Card>

            <Card className={cn(
              "bg-card",
              "transition-colors duration-200"
            )}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Completed Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CompletedOrdersTable 
                  orders={orders || []} 
                  onOrderClick={setSelectedCompletedOrder}
                  onReuseOrder={handleReuseOrder}
                  isAdmin={true}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                />
              </CardContent>
            </Card>
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