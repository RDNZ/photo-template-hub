import { Settings } from "lucide-react";

interface OrderSpecificationsProps {
  photoBoxes: number;
  darkroomFile: boolean;
  turnaroundTime: string;
}

export const OrderSpecifications = ({ 
  photoBoxes, 
  darkroomFile, 
  turnaroundTime 
}: OrderSpecificationsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Settings className="h-5 w-5" />
        Order Specifications
      </h3>
      <div className="grid gap-3 text-sm">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Photo Boxes</span>
          <span className="font-medium">{photoBoxes}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Darkroom File</span>
          <span className="font-medium">{darkroomFile ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Turnaround Time</span>
          <span className="font-medium">{turnaroundTime}</span>
        </div>
      </div>
    </div>
  );
};