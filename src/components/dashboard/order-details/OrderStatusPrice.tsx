import { StatusBadgePrice } from "./status-price/StatusBadgePrice";
import { PreviewSection } from "./status-price/PreviewSection";
import { usePreviewUploader } from "./status-price/PreviewUploader";

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
  const { handleNewPreviewUpload } = usePreviewUploader({ orderId: orderId || '' });

  return (
    <div className="space-y-4">
      {!hideStatusPrice && (
        <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
          <StatusBadgePrice status={status} price={price} />
        </div>
      )}
      
      {previewImage && (
        <PreviewSection 
          orderId={orderId}
          status={status}
          previewImage={previewImage}
          previewFeedback={previewFeedback}
          isAdmin={isAdmin}
          onNewPreviewUpload={handleNewPreviewUpload}
        />
      )}
    </div>
  );
};