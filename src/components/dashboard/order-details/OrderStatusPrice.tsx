import { StatusBadgePrice } from "./status-price/StatusBadgePrice";
import { PreviewImage } from "./status-price/PreviewImage";
import { FeedbackForm } from "./status-price/FeedbackForm";
import { useState } from "react";
import { ImagePreviewDialog } from "./images/ImagePreviewDialog";
import { ImageDetails } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderStatusPriceProps {
  orderId?: string;
  status: string;
  price: number;
  previewImage?: string | null;
  previewFeedback?: string | null;
  hideStatusPrice?: boolean;
  isAdmin?: boolean;
}

export const OrderStatusPrice = ({ 
  orderId,
  status, 
  price, 
  previewImage,
  previewFeedback,
  hideStatusPrice = false,
  isAdmin = false
}: OrderStatusPriceProps) => {
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleNewPreviewUpload = async (file: File) => {
    if (!orderId) return;

    console.log("Uploading new preview for order:", orderId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}_preview.${fileExt}`;

    try {
      // First, try to remove any existing file to avoid conflicts
      await supabase.storage
        .from('preview_images')
        .remove([fileName]);

      // Upload the new file
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('preview_images')
        .upload(fileName, file, {
          cacheControl: '0',
          upsert: true
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully, getting public URL");
      
      const { data: { publicUrl } } = supabase.storage
        .from('preview_images')
        .getPublicUrl(fileName);

      console.log("Generated public URL:", publicUrl);
      
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          preview_image: publicUrl,
          status: 'preview_ready'
        })
        .eq('id', orderId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      console.log("Order updated successfully with new preview image");
      
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      
      toast({
        title: "Success",
        description: "New preview uploaded and status updated",
      });
    } catch (error) {
      console.error('Error handling preview upload:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload new preview image",
      });
    }
  };

  return (
    <div className="space-y-4">
      {!hideStatusPrice && <StatusBadgePrice status={status} price={price} />}
      
      {previewImage && (
        <div className="pt-4">
          <h3 className="font-semibold mb-2">Preview Image</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PreviewImage 
              previewImage={previewImage} 
              onClick={() => setSelectedImage({ url: previewImage, name: 'Preview Image' })}
              onUploadNewPreview={isAdmin && status === 'in_revision' ? handleNewPreviewUpload : undefined}
              showUpload={isAdmin && status === 'in_revision'}
            />

            <div className="space-y-4">
              {status === 'preview_ready' && orderId && !isAdmin && (
                <FeedbackForm 
                  orderId={orderId}
                  initialFeedback={previewFeedback || ""}
                />
              )}

              {previewFeedback && (status === 'in_revision' || status === 'preview_ready') && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Client Feedback</h4>
                  <p className="text-sm text-muted-foreground">{previewFeedback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ImagePreviewDialog
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        onDownload={(url, filename) => {
          const img = document.createElement('a');
          img.href = url;
          img.download = filename;
          document.body.appendChild(img);
          img.click();
          document.body.removeChild(img);
        }}
      />
    </div>
  );
};