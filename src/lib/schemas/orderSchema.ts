import * as z from "zod";

export const orderFormSchema = z.object({
  event_name: z.string().min(1, "Event name is required"),
  software_type: z.string().min(1, "Software type is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  turnaround_time: z.string().min(1, "Turnaround time is required"),
  email: z.string().email("Invalid email address"),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

// Type for the complete order data that matches Supabase schema
export type OrderData = {
  event_name: string;
  software_type: string;
  dimensions: string;
  turnaround_time: string;
  price: number;
  user_id: string;
  status?: string;
  preview_image?: string;
  final_file?: string;
  created_at?: string;
  updated_at?: string;
};