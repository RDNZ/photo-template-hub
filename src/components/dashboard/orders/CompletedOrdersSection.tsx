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
  return (
    <Card className={cn(
      "bg-brand-gray-light",
      "transition-colors duration-200"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-gray-dark">
          <ClipboardList className="h-5 w-5 text-brand-teal" />
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