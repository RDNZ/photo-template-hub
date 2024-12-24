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
    case "touchpix":
      return [
        { value: "1072x1920", label: "1072x1920px" },
        { value: "1072x1440", label: "1072x1440px" },
        { value: "1072x1072", label: "1072x1072px" },
        { value: "1440x1072", label: "1440x1072px" },
        { value: "1920x1072", label: "1920x1072px" },
      ];
    case "revospin_360":
      return [
        { value: "1080x1918", label: "Portrait - 1080px x 1918px" },
        { value: "1918x1080", label: "Landscape - 1918px x 1080px" },
        { value: "1080x1080", label: "Square - 1080px x 1080px" },
      ];
    case "spinner_360":
      return [
        { value: "1920x1080", label: "16:9 - 1920 x 1080px" },
        { value: "1080x1080", label: "1:1 - 1080 x 1080px" },
      ];
    case "dslr_booth":
      return [
        { value: "6x4_horizontal", label: "6x4 (Horizontal)" },
        { value: "4x6_vertical", label: "4x6 (Vertical)" },
        { value: "2x6_strip", label: "2x6 (Strip)" },
        { value: "square", label: "Square" },
      ];
    case "amazebooth":
      return [
        { value: "1220x1820", label: "Landscape: 1220x1820" },
        { value: "1820x1220", label: "Portrait: 1820x1220" },
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