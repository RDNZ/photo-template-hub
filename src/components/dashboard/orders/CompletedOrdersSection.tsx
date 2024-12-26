import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { CompletedOrdersTable } from "../CompletedOrdersTable";
import { Order } from "@/integrations/supabase/types/orders";
import { cn } from "@/lib/utils";

interface CompletedOrdersSectionProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onReuseOrder: (order: Order) => void;
  isAdmin?: boolean;
  searchTerm: string;
  statusFilter: string;
}

export const CompletedOrdersSection = ({
  orders,
  onOrderClick,
  onReuseOrder,
  isAdmin = false,
  searchTerm,
  statusFilter,
}: CompletedOrdersSectionProps) => {
  console.log(`Rendering Completed Orders section with ${orders.length} orders`);
  
  return (
    <Card className={cn(
      "section-card",
      "bg-gradient-to-br from-brand-gray-light/50 to-transparent"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-brand-gray-dark">
          <ClipboardList className="h-6 w-6 text-brand-teal" />
          Completed Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CompletedOrdersTable 
          orders={orders} 
          onOrderClick={onOrderClick}
          onReuseOrder={onReuseOrder}
          isAdmin={isAdmin}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />
      </CardContent>
    </Card>
  );
};