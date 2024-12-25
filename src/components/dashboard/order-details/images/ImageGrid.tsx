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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {imageUrls.map((url, index) => {
        const fileName = referenceImages[index]?.name || `Reference ${index + 1}`;
        return (
          <ImageGridItem
            key={url}
            url={url}
            fileName={fileName}
            onImageClick={() => onImageSelect(url, fileName)}
            onDownload={(e) => {
              e.stopPropagation();
              onDownload(url, fileName);
            }}
          />
        );
      })}
    </div>
  );
};