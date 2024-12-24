import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: string;
  event_name: string;
  software_type: string;
  turnaround_time: string;
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

export const OrdersTable = ({ orders }: OrdersTableProps) => (
  <div className="border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event Name</TableHead>
          <TableHead>Software Type</TableHead>
          <TableHead>Turnaround Time</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.event_name}</TableCell>
              <TableCell>{order.software_type}</TableCell>
              <TableCell>{order.turnaround_time}</TableCell>
              <TableCell>{formatPrice(order.price)}</TableCell>
              <TableCell className="capitalize">{order.status}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No orders found. Create your first order!
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);