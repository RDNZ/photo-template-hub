import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageGridItem } from "./ImageGridItem";

interface ImageGridProps {
  imageUrls: string[];
  referenceImages: any[];
  onImageSelect: (url: string, name: string) => void;
  onDownload: (url: string, filename: string) => void;
}

export const ImageGrid = ({
  imageUrls,
  referenceImages,
  onImageSelect,
  onDownload,
}: ImageGridProps) => {
  return (
    <ScrollArea className="w-full">
      <div className="flex flex-nowrap gap-4 pb-4 md:grid md:grid-cols-3 md:flex-wrap">
        {imageUrls.map((url, index) => {
          const fileName = referenceImages[index]?.name || `Reference ${index + 1}`;
          return (
            <div key={url} className="w-48 flex-none md:w-full">
              <ImageGridItem
                url={url}
                fileName={fileName}
                onImageClick={() => onImageSelect(url, fileName)}
                onDownload={(e) => {
                  e.stopPropagation();
                  onDownload(url, fileName);
                }}
              />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};