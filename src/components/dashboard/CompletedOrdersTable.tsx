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
    const matchesSearch = order.event_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const isCompleted = order.status === 'completed';
    return matchesSearch && matchesStatus && isCompleted;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Completed Orders</h2>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <OrdersTableHeader isAdmin={isAdmin} showReuse={!isAdmin} />
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
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