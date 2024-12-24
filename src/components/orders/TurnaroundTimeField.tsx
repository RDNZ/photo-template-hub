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

interface TurnaroundTimeFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

export const TurnaroundTimeField = ({ form }: TurnaroundTimeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="turnaround_time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Turnaround Time</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select turnaround time" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="24h">24 Hours (+50%)</SelectItem>
              <SelectItem value="48h">48 Hours (+25%)</SelectItem>
              <SelectItem value="72h">72 Hours (Standard)</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};