import { FileText } from "lucide-react";

interface OrderAdditionalInfoProps {
  details: string | null;
}

export const OrderAdditionalInfo = ({ details }: OrderAdditionalInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FileText className="h-5 w-5" />
        Additional Details
      </h3>
      <p className="text-sm whitespace-pre-wrap">
        {details || 'No additional details provided.'}
      </p>
    </div>
  );
};