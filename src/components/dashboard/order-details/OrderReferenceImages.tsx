import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface OrderReferenceImagesProps {
  imageUrls: string[];
  referenceImages: any[];
}

export const OrderReferenceImages = ({ imageUrls, referenceImages }: OrderReferenceImagesProps) => {
  const [selectedImage, setSelectedImage] = useState<{url: string, name: string} | null>(null);

  if (imageUrls.length === 0) return null;

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
    <>
      <div>
        <h3 className="font-semibold mb-2">Reference Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Reference ${index + 1}`}
                className="rounded-lg object-cover w-full aspect-square cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => setSelectedImage({
                  url,
                  name: referenceImages[index]?.name || `Reference ${index + 1}`
                })}
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(url, referenceImages[index]?.name || `reference-${index + 1}.jpg`);
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
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
              className="absolute top-2 right-2"
              onClick={() => selectedImage && handleDownload(selectedImage.url, selectedImage.name)}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};