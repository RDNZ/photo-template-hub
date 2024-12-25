import { Json } from "../types";
import { Profile } from "./profiles";

// Define a type for the partial profile data we get from the join
type OrderProfile = Pick<Profile, 'name' | 'email'>;

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
  profiles?: OrderProfile | null;
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