import { useState } from "react";
import { PreviewImage } from "./PreviewImage";
import { FeedbackForm } from "./FeedbackForm";
import { ImagePreviewDialog } from "../images/ImagePreviewDialog";
import { ImageDetails } from "../types";

interface PreviewSectionProps {
  orderId?: string;
  status: string;
  previewImage: string;
  previewFeedback?: string | null;
  isAdmin?: boolean;
  onNewPreviewUpload?: (file: File) => Promise<void>;
}

export const PreviewSection = ({
  orderId,
  status,
  previewImage,
  previewFeedback,
  isAdmin = false,
  onNewPreviewUpload
}: PreviewSectionProps) => {
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);

  return (
    <div className="pt-4">
      <h3 className="font-semibold mb-2">Preview Image</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PreviewImage 
          previewImage={previewImage} 
          onClick={() => setSelectedImage({ url: previewImage, name: 'Preview Image' })}
          onUploadNewPreview={isAdmin && status === 'in_revision' ? onNewPreviewUpload : undefined}
          showUpload={isAdmin && status === 'in_revision'}
        />

        <div className="space-y-4">
          {status === 'preview_ready' && orderId && !isAdmin && (
            <FeedbackForm 
              orderId={orderId}
              initialFeedback={previewFeedback || ""}
            />
          )}

          {previewFeedback && (status === 'in_revision' || status === 'preview_ready') && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Client Feedback</h4>
              <p className="text-sm text-muted-foreground">{previewFeedback}</p>
            </div>
          )}
        </div>
      </div>

      <ImagePreviewDialog
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
        onDownload={(url, filename) => {
          const img = document.createElement('a');
          img.href = url;
          img.download = filename;
          document.body.appendChild(img);
          img.click();
          document.body.removeChild(img);
        }}
      />
    </div>
  );
};