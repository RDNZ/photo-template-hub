import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  event_name: string;
  software_type: string;
  dimensions: string;
  turnaround_time: string;
  photo_boxes: number;
  darkroom_file?: boolean;
  details?: string;
  price: number;
  status: string;
}

interface OrdersTableProps {
  orders: Order[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "submitted":
      return "default";
    case "in_progress":
      return "secondary";
    case "preview_ready":
      return "outline";
    case "completed":
      return "secondary";
    default:
      return "default";
  }
};

export const OrdersTable = ({ orders }: OrdersTableProps) => (
  <div className="border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Software Type</TableHead>
          <TableHead>Dimensions</TableHead>
          <TableHead>Photo Boxes</TableHead>
          <TableHead>Darkroom File</TableHead>
          <TableHead>Turnaround Time</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.event_name}</TableCell>
              <TableCell className="capitalize">{order.software_type.replace(/_/g, ' ')}</TableCell>
              <TableCell>{order.dimensions}</TableCell>
              <TableCell>{order.photo_boxes}</TableCell>
              <TableCell>{order.darkroom_file ? 'Yes' : 'No'}</TableCell>
              <TableCell>{order.turnaround_time}</TableCell>
              <TableCell className="max-w-[200px] truncate" title={order.details || ''}>
                {order.details || '-'}
              </TableCell>
              <TableCell>{formatPrice(order.price)}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4">
              No orders found. Create your first order!
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);