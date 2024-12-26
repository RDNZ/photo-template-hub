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
      "section-card",
      "bg-gradient-to-br from-brand-teal/5 to-transparent"
    )}>
      <CardHeader>
        <CardTitle className="section-header">
          <ClipboardList className="h-6 w-6 text-brand-teal" />
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