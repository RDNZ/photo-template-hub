import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PreviewUploadButtonProps {
  orderId: string;
}

export const PreviewUploadButton = ({ orderId }: PreviewUploadButtonProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handlePreviewUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      console.log("Starting preview upload for order:", orderId);
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Preview file must be less than 5MB",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${orderId}_preview.${fileExt}`;

      console.log("Uploading file to storage:", fileName);
      const { error: uploadError } = await supabase.storage
        .from('preview_images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('preview_images')
        .getPublicUrl(fileName);

      console.log("File uploaded successfully, updating order with public URL:", publicUrl);
      
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          preview_image: publicUrl,
          status: 'preview_ready'
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      console.log("Order updated successfully with preview image and status");
      
      // Invalidate both queries to ensure UI updates properly
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      
      toast({
        title: "Success",
        description: "Preview uploaded and status updated to preview ready",
      });
    } catch (error) {
      console.error('Error uploading preview:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload preview image",
      });
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="preview-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handlePreviewUpload}
        className="hidden"
        id={`preview-upload-${orderId}`}
      />
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={(e) => {
          e.stopPropagation();
          document.getElementById(`preview-upload-${orderId}`)?.click();
        }}
      >
        <Upload className="h-4 w-4" />
        Upload Preview
      </Button>
    </div>
  );
};