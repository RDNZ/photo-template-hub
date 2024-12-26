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
      {!hideStatusPrice && <StatusBadgePrice status={status} price={price} />}
      
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