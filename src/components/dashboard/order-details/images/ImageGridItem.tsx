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
    <div className="relative group">
      <div className="relative">
        <img
          src={url}
          alt={fileName}
          className="rounded-lg w-full h-48 object-cover cursor-pointer"
          onClick={onImageClick}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 truncate">
          {fileName}
        </div>
      </div>
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDownload}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};