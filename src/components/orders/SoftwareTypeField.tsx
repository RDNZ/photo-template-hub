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
  console.log("Current software type value:", form.watch("software_type"));
  
  return (
    <FormField
      control={form.control}
      name="software_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Software Type</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select software type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="touchpix">Touchpix</SelectItem>
              <SelectItem value="darkroom_booth_3">Darkroom Booth 3</SelectItem>
              <SelectItem value="revospin_360">RevoSpin 360</SelectItem>
              <SelectItem value="spinner_360">Spinner 360</SelectItem>
              <SelectItem value="dslr_booth">dslrBooth</SelectItem>
              <SelectItem value="salsa_booth">Salsa Booth</SelectItem>
              <SelectItem value="amazebooth">Amazebooth</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};