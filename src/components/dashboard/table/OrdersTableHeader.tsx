import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const OrdersTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="border-r border-muted/30">Event Name</TableHead>
      <TableHead className="border-r border-muted/30">Software Type</TableHead>
      <TableHead className="border-r border-muted/30">Dimensions</TableHead>
      <TableHead className="border-r border-muted/30">Photo Boxes</TableHead>
      <TableHead className="border-r border-muted/30">Darkroom File</TableHead>
      <TableHead className="border-r border-muted/30">Turnaround Time</TableHead>
      <TableHead className="border-r border-muted/30">Details</TableHead>
      <TableHead className="border-r border-muted/30">Price</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
);