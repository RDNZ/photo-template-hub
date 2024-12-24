import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

interface DetailsFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

export const DetailsField = ({ form }: DetailsFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="details"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Additional Details</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter any specific requirements or details"
              className="min-h-[100px]"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};