import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/lib/schemas/orderSchema";
import { EmailField } from "./EmailField";
import { EventNameField } from "./EventNameField";
import { SoftwareTypeField } from "./SoftwareTypeField";
import { DimensionsField } from "./DimensionsField";
import { PhotoBoxesField } from "./PhotoBoxesField";
import { DetailsField } from "./DetailsField";
import { ReferenceImagesField } from "./ReferenceImagesField";
import { TurnaroundTimeField } from "./TurnaroundTimeField";
import { DarkroomFileField } from "./DarkroomFileField";
import { Mail, CalendarDays, Settings2, Camera, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrderFormFieldsProps {
  form: UseFormReturn<OrderFormValues>;
}

export const OrderFormFields = ({ form }: OrderFormFieldsProps) => {
  return (
    <div className="space-y-8">
      {/* User Info Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-brand-gray-dark">
          <Mail className="h-5 w-5 text-brand-teal" />
          <h2>User Information</h2>
        </div>
        <Separator className="bg-brand-teal/10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmailField form={form} />
          <EventNameField form={form} />
        </div>
      </div>

      {/* Specifications Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-brand-gray-dark">
          <Settings2 className="h-5 w-5 text-brand-teal" />
          <h2>Specifications</h2>
        </div>
        <Separator className="bg-brand-teal/10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SoftwareTypeField form={form} />
          <DimensionsField form={form} />
        </div>
        <div className="grid grid-cols-1 gap-6">
          <PhotoBoxesField form={form} />
          <DetailsField form={form} />
        </div>
      </div>

      {/* Reference Images Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-brand-gray-dark">
          <Camera className="h-5 w-5 text-brand-teal" />
          <h2>Reference Images</h2>
        </div>
        <Separator className="bg-brand-teal/10" />
        <ReferenceImagesField form={form} />
      </div>

      {/* Turnaround Time Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-brand-gray-dark">
          <Clock className="h-5 w-5 text-brand-teal" />
          <h2>Turnaround Time</h2>
        </div>
        <Separator className="bg-brand-teal/10" />
        <div className="grid grid-cols-1 gap-6">
          <TurnaroundTimeField form={form} />
          <DarkroomFileField form={form} />
        </div>
      </div>
    </div>
  );
};