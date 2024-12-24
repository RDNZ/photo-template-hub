import { Json } from "../types";

export type Order = {
  id: string;
  user_id: string | null;
  event_name: string;
  software_type: string;
  dimensions: string;
  turnaround_time: string;
  price: number;
  status: string;
  preview_image: string | null;
  final_file: string | null;
  created_at: string;
  updated_at: string;
  details: string | null;
  reference_images: Json | null;
  photo_boxes: number | null;
  darkroom_file: boolean | null;
};

export type OrderInsert = {
  user_id?: string | null;
  event_name: string;
  software_type: string;
  dimensions: string;
  turnaround_time: string;
  price: number;
  status?: string;
  preview_image?: string | null;
  final_file?: string | null;
  details?: string | null;
  reference_images?: Json | null;
  photo_boxes?: number | null;
  darkroom_file?: boolean | null;
};

export type OrderUpdate = {
  user_id?: string | null;
  event_name?: string;
  software_type?: string;
  dimensions?: string;
  turnaround_time?: string;
  price?: number;
  status?: string;
  preview_image?: string | null;
  final_file?: string | null;
  details?: string | null;
  reference_images?: Json | null;
  photo_boxes?: number | null;
  darkroom_file?: boolean | null;
};