import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const OrderHeader = () => {
  return (
    <DialogHeader className="px-6 pt-6 pb-4 bg-brand-teal">
      <DialogTitle className="text-white">Order Details</DialogTitle>
    </DialogHeader>
  );
};