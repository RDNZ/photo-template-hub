import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrdersTableHeaderProps {
  isAdmin?: boolean;
  showReuse?: boolean;
}

export const OrdersTableHeader = ({ isAdmin = false, showReuse = false }: OrdersTableHeaderProps) => (
  <TableHeader>
    <TableRow>
      {isAdmin && (
        <>
          <TableHead className="border-r border-muted/30">Client Name</TableHead>
          <TableHead className="border-r border-muted/30">Client Email</TableHead>
        </>
      )}
      <TableHead className="border-r border-muted/30">Event Name</TableHead>
      <TableHead className="border-r border-muted/30">Software Type</TableHead>
      <TableHead className="border-r border-muted/30">Dimensions</TableHead>
      <TableHead className="border-r border-muted/30">Photo Boxes</TableHead>
      <TableHead className="border-r border-muted/30">Darkroom File</TableHead>
      <TableHead className="border-r border-muted/30">Turnaround Time</TableHead>
      <TableHead className="border-r border-muted/30">Details</TableHead>
      <TableHead className="border-r border-muted/30">Price</TableHead>
      <TableHead>Status</TableHead>
      {showReuse && <TableHead>Actions</TableHead>}
    </TableRow>
  </TableHeader>
);