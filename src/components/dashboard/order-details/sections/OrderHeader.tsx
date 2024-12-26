import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

export const OrderHeader = () => {
  return (
    <DialogHeader className="px-6 pt-6 pb-4 bg-brand-teal relative">
      <DialogTitle className="text-white">Order Details</DialogTitle>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-5 w-5 text-white" />
        <span className="sr-only">Close</span>
      </button>
    </DialogHeader>
  );
};