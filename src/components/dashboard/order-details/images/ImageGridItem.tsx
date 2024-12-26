import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ImageGridItemProps {
  url: string;
  fileName: string;
  onImageClick: () => void;
  onDownload: (e: React.MouseEvent) => void;
}

export const ImageGridItem = ({
  url,
  fileName,
  onImageClick,
  onDownload,
}: ImageGridItemProps) => {
  return (
    <div className="relative group rounded-lg overflow-hidden bg-muted cursor-pointer">
      <div className="relative aspect-square">
        <img
          src={url}
          alt={fileName}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          onClick={onImageClick}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-sm truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {fileName}
        </div>
      </div>
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={onDownload}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};