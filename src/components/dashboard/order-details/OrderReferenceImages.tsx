import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderReferenceImagesProps {
  imageUrls: string[];
  referenceImages: any[];
}

interface ImageDetails {
  url: string;
  name: string;
}

export const OrderReferenceImages = ({
  imageUrls,
  referenceImages,
}: OrderReferenceImagesProps) => {
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);

  if (!referenceImages || referenceImages.length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-2">Reference Images</h3>
        <p>No reference images provided.</p>
      </div>
    );
  }

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Reference Images</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt={`Reference ${index + 1}`}
              className="rounded-lg w-full h-48 object-cover cursor-pointer"
              onClick={() => setSelectedImage({
                url,
                name: referenceImages[index].name || `Reference ${index + 1}`
              })}
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(url, referenceImages[index].name || `reference-${index + 1}.jpg`);
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selectedImage?.name}</DialogTitle>
          </DialogHeader>
          <div className="relative flex items-center justify-center p-4 w-full h-full">
            <img
              src={selectedImage?.url}
              alt={selectedImage?.name}
              className="rounded-lg max-w-full max-h-[70vh] object-contain"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => selectedImage && handleDownload(selectedImage.url, selectedImage.name)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};