import { DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order } from "@/integrations/supabase/types/orders";
import { OrderHeader } from "./sections/OrderHeader";
import { OrderEventDetails } from "./sections/OrderEventDetails";
import { OrderSpecifications } from "./sections/OrderSpecifications";
import { OrderAdditionalInfo } from "./sections/OrderAdditionalInfo";
import { OrderReferenceImages } from "./OrderReferenceImages";
import { OrderStatusPrice } from "./status-price/OrderStatusPrice";

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
      <OrderHeader eventName={order.event_name} />
      
      <ScrollArea className="flex-1 px-6">
        <div className="space-y-8 py-6 pr-4">
          <OrderStatusPrice 
            orderId={order.id}
            status={order.status} 
            price={order.price || 0} 
            isAdmin={isAdmin}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <OrderEventDetails 
              eventName={order.event_name}
              softwareType={order.software_type}
              dimensions={order.dimensions}
            />
            
            <OrderSpecifications 
              photoBoxes={order.photo_boxes || 1}
              darkroomFile={order.darkroom_file || false}
              turnaroundTime={order.turnaround_time}
            />
          </div>

          <OrderAdditionalInfo details={order.details} />

          <OrderReferenceImages 
            imageUrls={imageUrls} 
            referenceImages={order.reference_images as any[]} 
          />

          {order.preview_image && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OrderStatusPrice 
                orderId={order.id}
                status={order.status} 
                price={order.price || 0}
                previewImage={order.preview_image}
                previewFeedback={order.preview_feedback}
                hideStatusPrice
                isAdmin={isAdmin}
              />
              {order.preview_feedback && (
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Client Feedback</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {order.preview_feedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  );
};