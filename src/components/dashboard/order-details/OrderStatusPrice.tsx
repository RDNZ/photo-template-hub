import { StatusBadgePrice } from "./status-price/StatusBadgePrice";
import { PreviewImage } from "./status-price/PreviewImage";
import { FeedbackForm } from "./status-price/FeedbackForm";
import { useState } from "react";
import { ImagePreviewDialog } from "./images/ImagePreviewDialog";
import { ImageDetails } from "./types";

interface OrderStatusPriceProps {
  orderId?: string;
  status: string;
  price: number;
  previewImage?: string | null;
  previewFeedback?: string | null;
}

export const OrderStatusPrice = ({ 
  orderId,
  status, 
  price, 
  previewImage,
  previewFeedback 
}: OrderStatusPriceProps) => {
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);

  return (
    <div className="space-y-4 pt-4">
      <StatusBadgePrice status={status} price={price} />
      
      {previewImage && (
        <div className="pt-4">
          <h3 className="font-semibold mb-2">Preview Image</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PreviewImage 
              previewImage={previewImage} 
              onClick={() => setSelectedImage({ url: previewImage, name: 'Preview Image' })}
            />

            <div className="space-y-4">
              {status === 'preview_ready' && orderId && (
                <FeedbackForm 
                  orderId={orderId}
                  initialFeedback={previewFeedback || ""}
                />
              )}

              {previewFeedback && status === 'in_revision' && (
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
          // Using the existing download functionality from PreviewImage
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