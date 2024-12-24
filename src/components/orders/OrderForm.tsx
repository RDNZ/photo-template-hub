import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { orderFormSchema, type OrderFormValues } from "@/lib/schemas/orderSchema";
import { supabase } from "@/integrations/supabase/client";
import { EmailField } from "./EmailField";
import { EventNameField } from "./EventNameField";
import { SoftwareTypeField } from "./SoftwareTypeField";
import { DimensionsField } from "./DimensionsField";
import { TurnaroundTimeField } from "./TurnaroundTimeField";
import { DetailsField } from "./DetailsField";
import { DarkroomFileField } from "./DarkroomFileField";
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
        <EmailField form={form} />
        <EventNameField form={form} />
        <SoftwareTypeField form={form} />
        <div className={`transition-opacity duration-300 ${softwareType ? 'opacity-100' : 'opacity-0'}`}>
          {softwareType && <DimensionsField form={form} />}
        </div>
        <DetailsField form={form} />
        <TurnaroundTimeField form={form} />
        <DarkroomFileField form={form} />

        <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Total Price:</span>
            <span className="text-lg font-bold">${totalPrice}</span>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || totalPrice === 0}>
            {isSubmitting ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </div>
      </form>
    </Form>
  );
};