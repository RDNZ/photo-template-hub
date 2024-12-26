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
  console.log("OrderCardsGrid - Rendering with orders:", orders.length);
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No orders found in this category. {showReuse ? "Completed orders will appear here." : "New orders will appear here."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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