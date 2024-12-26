import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreviewImageProps {
  previewImage: string;
}

export const PreviewImage = ({ previewImage }: PreviewImageProps) => {
  const { toast } = useToast();

  const handlePreviewDownload = async () => {
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

  return (
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
  );
};