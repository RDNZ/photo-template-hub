import { useState } from "react";
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