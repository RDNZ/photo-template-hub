import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { OrdersTable } from "../OrdersTable";
import { Order } from "@/integrations/supabase/types/orders";
import { cn } from "@/lib/utils";

interface OrdersSectionProps {
  title: string;
  orders: Order[];
  isAdmin?: boolean;
  searchTerm: string;
  statusFilter: string;
}

export const OrdersSection = ({
  title,
  orders,
  isAdmin = false,
  searchTerm,
  statusFilter,
}: OrdersSectionProps) => {
  console.log(`Rendering ${title} section with ${orders.length} orders`);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-6 w-6 text-brand-teal" />
        <h2 className="text-xl font-semibold text-brand-gray-dark">{title}</h2>
      </div>
      
      <Card className={cn(
        "section-card",
        "bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
      )}>
        <CardContent className="p-6">
          <OrdersTable 
            orders={orders} 
            isAdmin={isAdmin}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
        </CardContent>
      </Card>
    </div>
  );
};