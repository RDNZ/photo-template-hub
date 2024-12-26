import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { ImageDetails } from "../types";

interface ImagePreviewDialogProps {
  selectedImage: ImageDetails | null;
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
}

export const ImagePreviewDialog = ({
  selectedImage,
  onClose,
  onDownload,
}: ImagePreviewDialogProps) => {
  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col bg-background p-0">
        <div className="relative w-full">
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onDownload(selectedImage.url, selectedImage.name)}
              className="bg-white/90 hover:bg-white"
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download image</span>
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={onClose}
              className="bg-white/90 hover:bg-white"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close dialog</span>
            </Button>
          </div>
          <div className="h-[85vh] w-full flex items-center justify-center p-4">
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};