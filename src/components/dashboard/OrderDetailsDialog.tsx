import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Order } from "@/integrations/supabase/types/orders";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsDialog = ({ order, isOpen, onClose }: OrderDetailsDialogProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      // Check if reference_images exists and is an array
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "submitted":
        return "default";
      case "in_progress":
        return "secondary";
      case "preview_ready":
        return "outline";
      case "completed":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Order Details - {order.event_name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-1">
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Event Details</h3>
                <div className="space-y-2">
                  <p><span className="text-muted-foreground">Event Name:</span> {order.event_name}</p>
                  <p><span className="text-muted-foreground">Software Type:</span> {order.software_type.replace(/_/g, ' ')}</p>
                  <p><span className="text-muted-foreground">Dimensions:</span> {order.dimensions}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Specifications</h3>
                <div className="space-y-2">
                  <p><span className="text-muted-foreground">Photo Boxes:</span> {order.photo_boxes}</p>
                  <p><span className="text-muted-foreground">Darkroom File:</span> {order.darkroom_file ? 'Yes' : 'No'}</p>
                  <p><span className="text-muted-foreground">Turnaround Time:</span> {order.turnaround_time}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Additional Details</h3>
              <p className="whitespace-pre-wrap">{order.details || 'No additional details provided.'}</p>
            </div>

            {imageUrls.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Reference Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Reference ${index + 1}`}
                      className="rounded-lg object-cover w-full aspect-square"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <div>
                <span className="text-muted-foreground mr-2">Status:</span>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground mr-2">Price:</span>
                <span className="font-semibold">{formatPrice(order.price)}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};