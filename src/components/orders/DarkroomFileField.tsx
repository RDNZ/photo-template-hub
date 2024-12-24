import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

interface DarkroomFileFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

export const DarkroomFileField = ({ form }: DarkroomFileFieldProps) => {
  const softwareType = form.watch("software_type");

  if (softwareType !== "darkroom_booth_3") {
    return null;
  }

  return (
    <FormField
      control={form.control}
      name="darkroom_file"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Include Darkroom File (+$10)
            </FormLabel>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};