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
  console.log("Rendering OrderDialogContent with raw price:", order.price);
  console.log("Preview feedback:", order.preview_feedback);
  
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
          {order.preview_image && (
            <OrderStatusPrice 
              orderId={order.id}
              status={order.status} 
              price={order.price}
              previewImage={order.preview_image}
              previewFeedback={order.preview_feedback}
              hideStatusPrice
              isAdmin={isAdmin}
            />
          )}
          {order.preview_feedback && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Client Feedback</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {order.preview_feedback}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};