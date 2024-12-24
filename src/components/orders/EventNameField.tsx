import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

interface EventNameFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

export const EventNameField = ({ form }: EventNameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="event_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Event Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter event name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};