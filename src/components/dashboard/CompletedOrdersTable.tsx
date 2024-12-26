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
  console.log("CompletedOrdersTable - Initial orders:", orders.length);
  
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
    
    console.log(`Order ${order.id} - Completed: ${isCompleted}, Matches Search: ${matchesSearch}, Matches Status: ${matchesStatus}`);
    
    return matchesSearch && matchesStatus && isCompleted;
  });

  console.log("CompletedOrdersTable - Filtered orders:", filteredOrders.length);

  return (
    <OrderCardsGrid
      orders={filteredOrders}
      onOrderClick={onOrderClick}
      onReuseOrder={onReuseOrder}
      isAdmin={isAdmin}
      showReuse={!isAdmin}
    />
  );
};