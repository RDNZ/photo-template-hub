import * as z from "zod";

export const orderFormSchema = z.object({
  event_name: z.string().min(1, "Event name is required"),
  software_type: z.string().min(1, "Software type is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  turnaround_time: z.string().min(1, "Turnaround time is required"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;