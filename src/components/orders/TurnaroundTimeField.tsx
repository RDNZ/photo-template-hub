import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
              <SelectItem value="3d">3 Day Turnaround - $15</SelectItem>
              <SelectItem value="2d">2 Day Turnaround - $20</SelectItem>
              <SelectItem value="1d">1 Day Turnaround - $25</SelectItem>
              <SelectItem value="12h">12 Hour Turnaround - $30</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Choose your preferred turnaround time. Faster turnaround times have higher prices.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};