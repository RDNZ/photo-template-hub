import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();

  return (
    <div className={
      isMobile 
        ? "flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory" 
        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    }>
      {imageUrls.map((url, index) => {
        const fileName = referenceImages[index]?.name || `Reference ${index + 1}`;
        return (
          <div 
            key={url} 
            className={isMobile ? "flex-none w-[200px] snap-center" : ""}
          >
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
  );
};