interface OrderReferenceImagesProps {
  imageUrls: string[];
}

export const OrderReferenceImages = ({ imageUrls }: OrderReferenceImagesProps) => {
  if (imageUrls.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold mb-2">Reference Images</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Reference ${index + 1}`}
            className="rounded-lg object-cover w-full aspect-square"
          />
        ))}
      </div>
    </div>
  );
};