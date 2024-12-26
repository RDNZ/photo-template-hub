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
  return (
    <Card className={cn(
      "bg-brand-gray-light",
      "transition-colors duration-200"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-gray-dark">
          <ClipboardList className="h-5 w-5 text-brand-teal" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <OrdersTable 
          orders={orders} 
          isAdmin={isAdmin}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />
      </CardContent>
    </Card>
  );
};