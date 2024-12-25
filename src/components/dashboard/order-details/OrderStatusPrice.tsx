import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface OrderStatusPriceProps {
  status: string;
  price: number;
  previewImage?: string | null;
}

export const OrderStatusPrice = ({ status, price, previewImage }: OrderStatusPriceProps) => {
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

  const handlePreviewDownload = async () => {
    if (!previewImage) return;
    
    try {
      const response = await fetch(previewImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'preview-image.jpg'; // You can customize the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading preview:', error);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-muted-foreground mr-2">Status:</span>
          <Badge variant={getStatusBadgeVariant(status)}>
            {status.replace(/_/g, ' ')}
          </Badge>
        </div>
        <div>
          <span className="text-muted-foreground mr-2">Price:</span>
          <span className="font-semibold">{formatPrice(price)}</span>
        </div>
      </div>
      
      {previewImage && (
        <div className="pt-4">
          <h3 className="font-semibold mb-2">Preview Image</h3>
          <div className="relative group">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="rounded-lg w-full object-cover max-h-[300px]"
            />
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePreviewDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};