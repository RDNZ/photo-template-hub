import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OrderHeaderProps {
  eventName: string;
}

export const OrderHeader = ({ eventName }: OrderHeaderProps) => {
  return (
    <DialogHeader className="px-6 pt-6">
      <DialogTitle>Order Details - {eventName}</DialogTitle>
    </DialogHeader>
  );
};