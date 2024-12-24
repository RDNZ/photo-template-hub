import { TableCell, TableRow } from "@/components/ui/table";

export const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={9} className="text-center py-4">
      No orders found. Create your first order!
    </TableCell>
  </TableRow>
);