import { useState } from "react";
import { Camera } from "lucide-react";
import { ImageDetails } from "./types";
import { ImageGrid } from "./images/ImageGrid";
import { ImagePreviewDialog } from "./images/ImagePreviewDialog";

interface OrderReferenceImagesProps {
  imageUrls: string[];
  referenceImages: any[];
}

export const OrderReferenceImages = ({
  imageUrls,
  referenceImages,
}: OrderReferenceImagesProps) => {
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);

  if (!referenceImages || referenceImages.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Reference Images
        </h3>
        <p className="text-sm text-muted-foreground">No reference images provided.</p>
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
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Camera className="h-5 w-5" />
        Reference Images
      </h3>
      <ImageGrid
        imageUrls={imageUrls}
        referenceImages={referenceImages}
        onImageSelect={(url, name) => setSelectedImage({ url, name })}
        onDownload={handleDownload}
      />
      <ImagePreviewDialog
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        onDownload={handleDownload}
      />
    </div>
  );
};