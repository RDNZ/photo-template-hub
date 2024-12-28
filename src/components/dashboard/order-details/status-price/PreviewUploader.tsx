import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PreviewUploaderProps {
  orderId: string;
}

export const usePreviewUploader = ({ orderId }: PreviewUploaderProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleNewPreviewUpload = async (file: File) => {
    console.log("Starting preview upload for order:", orderId);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}_preview.${fileExt}`;

    try {
      // First, try to remove any existing file to avoid conflicts
      await supabase.storage
        .from('preview_images')
        .remove([fileName]);

      // Upload the new file
      const { error: uploadError } = await supabase.storage
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
      
      // Update the order with the new preview URL and status
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

      console.log("Order updated successfully with preview image");
      
      // Invalidate queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      await queryClient.invalidateQueries({ queryKey: ['clientOrders'] });
      
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

  return { handleNewPreviewUpload };
};