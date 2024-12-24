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

interface OrderFormFieldsProps {
  form: UseFormReturn<OrderFormValues>;
}

export const OrderFormFields = ({ form }: OrderFormFieldsProps) => {
  return (
    <>
      <EmailField form={form} />
      <EventNameField form={form} />
      <SoftwareTypeField form={form} />
      <DimensionsField form={form} />
      <PhotoBoxesField form={form} />
      <DetailsField form={form} />
      <ReferenceImagesField form={form} />
      <TurnaroundTimeField form={form} />
      <DarkroomFileField form={form} />
    </>
  );
};