import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order } from "@/integrations/supabase/types/orders";
import { OrderBasicInfo } from "./OrderBasicInfo";
import { OrderAdditionalDetails } from "./OrderAdditionalDetails";
import { OrderReferenceImages } from "./OrderReferenceImages";
import { OrderStatusPrice } from "./OrderStatusPrice";

interface OrderDialogContentProps {
  order: Order;
  imageUrls: string[];
  isAdmin?: boolean;
}

export const OrderDialogContent = ({ 
  order, 
  imageUrls, 
  isAdmin = false 
}: OrderDialogContentProps) => {
  console.log("Rendering OrderDialogContent with price:", order.price);
  
  return (
    <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
      <DialogHeader className="px-6 pt-6">
        <DialogTitle>Order Details - {order.event_name}</DialogTitle>
      </DialogHeader>
      <ScrollArea className="flex-1 px-6">
        <div className="space-y-6 py-4 pr-4">
          <OrderStatusPrice 
            orderId={order.id}
            status={order.status} 
            price={order.price}
            isAdmin={isAdmin}
          />
          <OrderBasicInfo order={order} />
          <OrderAdditionalDetails details={order.details} />
          <OrderReferenceImages 
            imageUrls={imageUrls} 
            referenceImages={order.reference_images as any[]} 
          />
          <OrderStatusPrice 
            orderId={order.id}
            status={order.status} 
            price={order.price}
            previewImage={order.preview_image}
            previewFeedback={order.preview_feedback}
            hideStatusPrice
            isAdmin={isAdmin}
          />
        </div>
      </ScrollArea>
    </DialogContent>
  );
};