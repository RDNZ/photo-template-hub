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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-6 w-6 text-brand-teal" />
        <h2 className="text-xl font-semibold text-brand-gray-dark">Completed Orders</h2>
      </div>
      
      <Card className={cn(
        "section-card",
        "bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
      )}>
        <CardContent className="p-6">
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
    </div>
  );
};