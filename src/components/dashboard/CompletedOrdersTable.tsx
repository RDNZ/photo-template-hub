import { Table, TableBody } from "@/components/ui/table";
import { Order } from "@/integrations/supabase/types/orders";
import { OrdersTableHeader } from "./table/OrdersTableHeader";
import { OrderTableRow } from "./table/OrderTableRow";
import { EmptyState } from "./table/EmptyState";

interface CompletedOrdersTableProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onReuseOrder: (order: Order) => void;
  isAdmin?: boolean;
}

export const CompletedOrdersTable = ({ 
  orders, 
  onOrderClick,
  onReuseOrder,
  isAdmin = false 
}: CompletedOrdersTableProps) => {
  const completedOrders = orders.filter(order => order.status === 'completed');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Completed Orders</h2>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <OrdersTableHeader isAdmin={isAdmin} showReuse={!isAdmin} />
          <TableBody>
            {completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  onClick={() => onOrderClick(order)}
                  onReuseOrder={() => onReuseOrder(order)}
                  isAdmin={isAdmin}
                  showReuse={!isAdmin}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};