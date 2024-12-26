import { Order } from "@/integrations/supabase/types/orders";
import { OrderCard } from "./OrderCard";

interface OrderCardsGridProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onReuseOrder?: (order: Order) => void;
  isAdmin?: boolean;
  showReuse?: boolean;
}

export const OrderCardsGrid = ({
  orders,
  onOrderClick,
  onReuseOrder,
  isAdmin = false,
  showReuse = false
}: OrderCardsGridProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onClick={() => onOrderClick(order)}
          onReuseOrder={onReuseOrder ? () => onReuseOrder(order) : undefined}
          isAdmin={isAdmin}
          showReuse={showReuse}
        />
      ))}
    </div>
  );
};