import * as z from "zod";

export const orderFormSchema = z.object({
  event_name: z.string().min(1, "Event name is required"),
  software_type: z.string().min(1, "Software type is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  turnaround_time: z.string().min(1, "Turnaround time is required"),
  details: z.string().optional(),
  email: z.string().email("Invalid email address"),
  darkroom_file: z.boolean().default(false),
  reference_images: z.array(z.any()).optional().default([]),
  photo_boxes: z.number().min(1, "Number of photo boxes is required").max(5).default(1),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export type OrderData = {
  event_name: string;
  software_type: string;
  dimensions: string;
  turnaround_time: string;
  details?: string;
  price: number;
  user_id: string;
  status?: string;
  preview_image?: string;
  final_file?: string;
  created_at?: string;
  updated_at?: string;
  darkroom_file: boolean;
  reference_images?: any[];
  photo_boxes: number;
};