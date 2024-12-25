import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ImageDetails } from "../types";

interface ImagePreviewDialogProps {
  selectedImage: ImageDetails | null;
  onClose: () => void;
  onDownload: (url: string, filename: string) => void;
}

export const ImagePreviewDialog = ({ 
  selectedImage, 
  onClose,
  onDownload 
}: ImagePreviewDialogProps) => {
  if (!selectedImage) return null;

  return (
    <Dialog open={!!selectedImage} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{selectedImage.name}</DialogTitle>
        </DialogHeader>
        <div className="relative flex items-center justify-center p-4 w-full h-full">
          <img
            src={selectedImage.url}
            alt={selectedImage.name}
            className="rounded-lg max-w-full max-h-[70vh] object-contain"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2"
            onClick={() => onDownload(selectedImage.url, selectedImage.name)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};