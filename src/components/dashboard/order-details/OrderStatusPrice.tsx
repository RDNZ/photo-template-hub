import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [feedback, setFeedback] = useState(previewFeedback || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
      case "in_revision":
        return "destructive";
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
      link.download = 'preview-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading preview:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download preview image",
      });
    }
  };

  const handleSubmitFeedback = async () => {
    if (!orderId || !feedback.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide feedback before submitting",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting feedback for order:', orderId);
      const { error } = await supabase
        .from('orders')
        .update({
          preview_feedback: feedback,
          status: 'in_revision'
        })
        .eq('id', orderId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Feedback submitted",
        description: "Your feedback has been sent to the designer",
      });
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
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

          {status === 'preview_ready' && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label htmlFor="feedback" className="text-sm font-medium">
                  Provide Feedback
                </label>
                <Textarea
                  id="feedback"
                  placeholder="Enter your feedback about the preview..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button 
                onClick={handleSubmitFeedback}
                disabled={isSubmitting || !feedback.trim()}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </div>
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