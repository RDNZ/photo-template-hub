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
}

export const OrdersTable = ({ orders, isAdmin = false }: OrdersTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const currentOrders = orders.filter(order => order.status !== 'completed');

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Orders</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <OrdersTableHeader isAdmin={isAdmin} />
            <TableBody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
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