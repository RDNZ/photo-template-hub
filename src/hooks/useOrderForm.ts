import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderFormSchema, type OrderFormValues } from "@/lib/schemas/orderSchema";
import { supabase } from "@/integrations/supabase/client";

export const useOrderForm = () => {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      event_name: "",
      software_type: "",
      dimensions: "",
      turnaround_time: "",
      details: "",
      email: "",
      darkroom_file: false,
      reference_images: [],
      photo_boxes: 1,
    },
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", session.user.id)
          .single();

        if (profile?.email) {
          form.setValue("email", profile.email);
        }
      }
    };

    loadUserProfile();
  }, [form]);

  return form;
};