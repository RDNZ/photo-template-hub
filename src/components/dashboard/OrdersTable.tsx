import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { Order } from "@/integrations/supabase/types/orders";
import { OrdersTableHeader } from "./table/OrdersTableHeader";
import { OrderTableRow } from "./table/OrderTableRow";
import { EmptyState } from "./table/EmptyState";

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
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Orders</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <OrdersTableHeader isAdmin={isAdmin} />
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    onClick={() => setSelectedOrder(order)}
                    isAdmin={isAdmin}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        isAdmin={isAdmin}
      />
    </>
  );
};