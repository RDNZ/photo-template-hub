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
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

interface DimensionsFieldProps {
  form: UseFormReturn<OrderFormValues>;
}

const getDimensionOptions = (softwareType: string) => {
  switch (softwareType) {
    case "darkroom_booth_3":
      return [
        { value: "6x4_horizontal", label: "6x4 (Horizontal)" },
        { value: "4x6_vertical", label: "4x6 (Vertical)" },
        { value: "2x6_strip", label: "2x6 (Strip)" },
        { value: "5x7_other", label: "5x7 (Other)" },
      ];
    default:
      return null;
  }
};

export const DimensionsField = ({ form }: DimensionsFieldProps) => {
  const softwareType = form.watch("software_type");
  const dimensionOptions = getDimensionOptions(softwareType);

  return (
    <FormField
      control={form.control}
      name="dimensions"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Dimensions</FormLabel>
          <FormControl>
            {dimensionOptions ? (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dimensions" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dimensionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder="Enter dimensions (e.g., 1920x1080)"
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};