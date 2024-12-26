import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreviewImageProps {
  previewImage: string;
  onClick: () => void;
  onUploadNewPreview?: (file: File) => Promise<void>;
  showUpload?: boolean;
}

export const PreviewImage = ({ 
  previewImage, 
  onClick,
  onUploadNewPreview,
  showUpload = false
}: PreviewImageProps) => {
  const { toast } = useToast();

  const handlePreviewDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      await onUploadNewPreview?.(file);
    } catch (error) {
      console.error('Error uploading new preview:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload new preview image",
      });
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img 
          src={previewImage} 
          alt="Preview" 
          className="rounded-lg w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 truncate">
          Preview Image
        </div>
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        {showUpload && (
          <div onClick={e => e.stopPropagation()}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="preview-upload"
            />
            <Button
              size="icon"
              variant="secondary"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => document.getElementById('preview-upload')?.click()}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button
          size="icon"
          variant="secondary"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handlePreviewDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};