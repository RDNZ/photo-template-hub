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
import { ListOrdered } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

interface PhotoBoxesFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

export const PhotoBoxesField = ({ form }: PhotoBoxesFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="photo_boxes"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <ListOrdered className="h-4 w-4" />
            Number of Photo Boxes
          </FormLabel>
          <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select number of photo boxes" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Box' : 'Boxes'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};