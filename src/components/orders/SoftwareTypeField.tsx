import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

interface SoftwareTypeFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

export const SoftwareTypeField = ({ form }: SoftwareTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="software_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Software Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select software type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="photoshop">Photoshop ($50)</SelectItem>
              <SelectItem value="illustrator">Illustrator ($75)</SelectItem>
              <SelectItem value="after_effects">After Effects ($100)</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};