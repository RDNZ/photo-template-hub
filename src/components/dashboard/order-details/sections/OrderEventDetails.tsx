import { Camera, FileText, Calendar } from "lucide-react";

interface OrderEventDetailsProps {
  eventName: string;
  softwareType: string;
  dimensions: string;
}

export const OrderEventDetails = ({ 
  eventName, 
  softwareType, 
  dimensions 
}: OrderEventDetailsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Event Details
      </h3>
      <div className="grid gap-3 text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Event Name</span>
          <span className="font-medium">{eventName}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Software Type</span>
          <span className="font-medium">{softwareType.replace(/_/g, ' ')}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Dimensions</span>
          <span className="font-medium">{dimensions}</span>
        </div>
      </div>
    </div>
  );
};