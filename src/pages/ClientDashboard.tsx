import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/dashboard/LoadingSpinner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { SuccessHandler } from "@/components/dashboard/SuccessHandler";
import { OrderDetailsDialog } from "@/components/dashboard/OrderDetailsDialog";
import { OrderSearch } from "@/components/dashboard/search/OrderSearch";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useClientOrders } from "@/hooks/useClientOrders";
import { Order } from "@/integrations/supabase/types/orders";
import { useToast } from "@/hooks/use-toast";
import { OrdersSection } from "@/components/dashboard/orders/OrdersSection";
import { CompletedOrdersSection } from "@/components/dashboard/orders/CompletedOrdersSection";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAuthChecking = useAuthCheck();
  const { data: orders, isLoading, error, refetch } = useClientOrders(isAuthChecking);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (isAuthChecking) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (error) {
    console.error("Error in orders query:", error);
    return <ErrorState onRetry={() => refetch()} />;
  }

  const handleReuseOrder = (order: Order) => {
    console.log("Reusing order:", order);
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
    toast({
      title: "Order details saved",
      description: "You can now create a new order with these details.",
    });
    navigate('/new-order');
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader onNewOrder={() => navigate('/new-order')} />
        <SuccessHandler onSuccess={refetch} />
        
        <OrderSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={statusFilter}
          onFilterChange={setStatusFilter}
        />

        {isLoading ? (
          <LoadingSpinner message="Loading orders..." />
        ) : (
          <div className="space-y-8">
            <OrdersSection 
              title="Current Orders"
              orders={orders || []} 
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
            
            <CompletedOrdersSection 
              orders={orders || []} 
              onOrderClick={(order) => {
                console.log("Opening completed order details:", order);
                setSelectedOrder(order);
              }}
              onReuseOrder={handleReuseOrder}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          </div>
        )}

        <OrderDetailsDialog
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </div>
  );
};

export default ClientDashboard;