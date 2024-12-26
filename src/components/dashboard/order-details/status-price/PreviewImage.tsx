import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreviewImageProps {
  previewImage: string;
  onClick: () => void;
}

export const PreviewImage = ({ previewImage, onClick }: PreviewImageProps) => {
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
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handlePreviewDownload}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};