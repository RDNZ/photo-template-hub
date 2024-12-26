import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/lib/schemas/orderSchema";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReferenceImagesFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

export const ReferenceImagesField = ({ form }: ReferenceImagesFieldProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const referenceImages = form.watch("reference_images") || [];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      if (referenceImages.length + files.length > 3) {
        toast({
          variant: "destructive",
          title: "Upload limit exceeded",
          description: "You can only upload up to 3 reference images",
        });
        return;
      }

      setUploading(true);
      const newImages = [];

      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            variant: "destructive",
            title: "File too large",
            description: "Each file must be less than 5MB",
          });
          continue;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("reference_images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          toast({
            variant: "destructive",
            title: "Upload failed",
            description: "Failed to upload image. Please try again.",
          });
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from("reference_images")
            .getPublicUrl(filePath);
          
          newImages.push({
            name: file.name,
            path: filePath,
            url: publicUrl
          });
        }
      }

      form.setValue("reference_images", [...referenceImages, ...newImages]);
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      console.error("Error handling file upload:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "An error occurred while uploading. Please try again.",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...referenceImages];
    newImages.splice(index, 1);
    form.setValue("reference_images", newImages);
  };

  return (
    <FormField
      control={form.control}
      name="reference_images"
      render={() => (
        <FormItem>
          <FormLabel>Reference Images</FormLabel>
          <FormControl>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {referenceImages.map((image: any, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Reference ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading || referenceImages.length >= 3}
                  className="hidden"
                  id="reference-images"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading || referenceImages.length >= 3}
                  onClick={() => document.getElementById("reference-images")?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Images"}
                </Button>
              </div>
            </div>
          </FormControl>
          <FormDescription>
            Upload up to 3 reference images (max 5MB each) to help us understand your requirements
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};