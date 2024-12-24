import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const OrdersTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="bg-muted/10">Event Name</TableHead>
      <TableHead>Software Type</TableHead>
      <TableHead className="bg-muted/10">Dimensions</TableHead>
      <TableHead>Photo Boxes</TableHead>
      <TableHead className="bg-muted/10">Darkroom File</TableHead>
      <TableHead>Turnaround Time</TableHead>
      <TableHead className="bg-muted/10">Details</TableHead>
      <TableHead>Price</TableHead>
      <TableHead className="bg-muted/10">Status</TableHead>
    </TableRow>
  </TableHeader>
);