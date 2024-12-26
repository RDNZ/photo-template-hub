import { Dialog } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Order } from "@/integrations/supabase/types/orders";
import { OrderDialogContent } from "./order-details/OrderDialogContent";
import { OrderRealTimeUpdates } from "./order-details/OrderRealTimeUpdates";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export const OrderDetailsDialog = ({ 
  order, 
  isOpen, 
  onClose,
  isAdmin = false 
}: OrderDetailsDialogProps) => {
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
      <OrderRealTimeUpdates orderId={order.id} />
      <OrderDialogContent 
        order={order}
        imageUrls={imageUrls}
        isAdmin={isAdmin}
      />
    </Dialog>
  );
};