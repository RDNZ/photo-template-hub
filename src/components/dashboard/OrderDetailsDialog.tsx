import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Order } from "@/integrations/supabase/types/orders";
import { OrderBasicInfo } from "./order-details/OrderBasicInfo";
import { OrderAdditionalDetails } from "./order-details/OrderAdditionalDetails";
import { OrderReferenceImages } from "./order-details/OrderReferenceImages";
import { OrderStatusPrice } from "./order-details/OrderStatusPrice";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsDialog = ({ order, isOpen, onClose }: OrderDetailsDialogProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const referenceImages = order?.reference_images as any[] | null;
      if (!referenceImages || !Array.isArray(referenceImages) || referenceImages.length === 0) return;
      
      const urls = await Promise.all(
        referenceImages.map(async (image) => {
          const { data } = supabase.storage
            .from('reference_images')
            .getPublicUrl(image.path);
          return data.publicUrl;
        })
      );
      setImageUrls(urls);
    };

    if (isOpen && order) {
      loadImages();
    }
  }, [isOpen, order]);

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Order Details - {order.event_name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1">
          <div className="space-y-6 px-1 py-4">
            <OrderBasicInfo order={order} />
            <OrderAdditionalDetails details={order.details} />
            <OrderReferenceImages 
              imageUrls={imageUrls} 
              referenceImages={order.reference_images as any[]} 
            />
            <OrderStatusPrice 
              status={order.status} 
              price={order.price}
              previewImage={order.preview_image}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};