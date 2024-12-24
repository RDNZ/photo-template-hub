import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { Order } from "@/integrations/supabase/types/orders";
import { OrdersTableHeader } from "./table/OrdersTableHeader";
import { OrderTableRow } from "./table/OrderTableRow";
import { EmptyState } from "./table/EmptyState";

interface OrdersTableProps {
  orders: Order[];
}

export const OrdersTable = ({ orders }: OrdersTableProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <OrdersTableHeader />
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </TableBody>
        </Table>
      </div>

      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};