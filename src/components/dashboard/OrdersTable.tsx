import { useState } from "react";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { Order } from "@/integrations/supabase/types/orders";
import { OrderCardsGrid } from "./cards/OrderCardsGrid";

interface OrdersTableProps {
  orders: Order[];
  isAdmin?: boolean;
  searchTerm?: string;
  statusFilter?: string;
}

export const OrdersTable = ({ 
  orders, 
  isAdmin = false,
  searchTerm = "",
  statusFilter = "all"
}: OrdersTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
    const isCurrentOrder = order.status !== 'completed';
    return matchesSearch && matchesStatus && isCurrentOrder;
  });

  return (
    <>
      <OrderCardsGrid
        orders={filteredOrders}
        onOrderClick={setSelectedOrder}
        isAdmin={isAdmin}
      />

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        isAdmin={isAdmin}
      />
    </>
  );
};