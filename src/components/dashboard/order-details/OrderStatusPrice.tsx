import { StatusBadgePrice } from "./status-price/StatusBadgePrice";
import { PreviewImage } from "./status-price/PreviewImage";
import { FeedbackForm } from "./status-price/FeedbackForm";

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
  return (
    <div className="space-y-4 pt-4">
      <StatusBadgePrice status={status} price={price} />
      
      {previewImage && (
        <div className="pt-4">
          <h3 className="font-semibold mb-2">Preview Image</h3>
          <PreviewImage previewImage={previewImage} />

          {status === 'preview_ready' && orderId && (
            <FeedbackForm 
              orderId={orderId}
              initialFeedback={previewFeedback || ""}
            />
          )}

          {previewFeedback && status === 'in_revision' && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Client Feedback</h4>
              <p className="text-sm text-muted-foreground">{previewFeedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};