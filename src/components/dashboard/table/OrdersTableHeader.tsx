import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const OrdersTableHeader = () => (
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
);