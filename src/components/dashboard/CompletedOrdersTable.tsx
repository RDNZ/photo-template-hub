import { Order } from "@/integrations/supabase/types/orders";
import { OrderCardsGrid } from "./cards/OrderCardsGrid";

interface CompletedOrdersTableProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onReuseOrder: (order: Order) => void;
  isAdmin?: boolean;
  searchTerm?: string;
  statusFilter?: string;
}

export const CompletedOrdersTable = ({ 
  orders, 
  onOrderClick,
  onReuseOrder,
  isAdmin = false,
  searchTerm = "",
  statusFilter = "all"
}: CompletedOrdersTableProps) => {
  const filteredOrders = orders.filter(order => {
    const searchFields = [
      order.event_name,
      order.software_type,
      order.dimensions,
      order.details,
      isAdmin ? order.profiles?.name : null,
      isAdmin ? order.profiles?.email : null
    ].filter(Boolean);

    const matchesSearch = searchTerm === "" || 
      searchFields.some(field => 
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const isCompleted = order.status === 'completed';
    return matchesSearch && matchesStatus && isCompleted;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Completed Orders</h2>
      <OrderCardsGrid
        orders={filteredOrders}
        onOrderClick={onOrderClick}
        onReuseOrder={onReuseOrder}
        isAdmin={isAdmin}
        showReuse={!isAdmin}
      />
    </div>
  );
};