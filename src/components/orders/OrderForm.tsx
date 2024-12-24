import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { orderFormSchema, type OrderFormValues } from "@/lib/schemas/orderSchema";
import { supabase } from "@/integrations/supabase/client";
import { OrderFormFields } from "./OrderFormFields";
import { PriceDisplay } from "./PriceDisplay";
import { FormActions } from "./FormActions";
import { calculateOrderPrice } from "@/lib/utils/priceCalculator";

interface OrderFormProps {
  onSubmit: (values: OrderFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const OrderForm = ({ onSubmit, isSubmitting, onCancel }: OrderFormProps) => {
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

  const softwareType = form.watch("software_type");
  const turnaroundTime = form.watch("turnaround_time");
  const darkroomFile = form.watch("darkroom_file");

  const totalPrice = useMemo(() => {
    if (!softwareType || !turnaroundTime) return 0;
    return calculateOrderPrice(softwareType, turnaroundTime, darkroomFile);
  }, [softwareType, turnaroundTime, darkroomFile]);

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

  const handleCheckout = async (values: OrderFormValues) => {
    try {
      const response = await supabase.functions.invoke('create-checkout', {
        body: { ...values, price: totalPrice }
      });

      if (response.error) throw response.error;

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCheckout)} className="space-y-6">
        <OrderFormFields form={form} />
        <PriceDisplay price={totalPrice} />
        <FormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          isDisabled={totalPrice === 0}
        />
      </form>
    </Form>
  );
};