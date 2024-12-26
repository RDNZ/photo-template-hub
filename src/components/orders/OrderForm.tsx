import { useMemo, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { OrderFormValues } from "@/lib/schemas/orderSchema";
import { OrderFormFields } from "./OrderFormFields";
import { PriceDisplay } from "./PriceDisplay";
import { FormActions } from "./FormActions";
import { calculateOrderPrice } from "@/lib/utils/priceCalculator";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useCheckout } from "@/hooks/useCheckout";

interface OrderFormProps {
  onSubmit: (values: OrderFormValues) => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export const OrderForm = ({ onSubmit, isSubmitting, onCancel }: OrderFormProps) => {
  const form = useOrderForm();
  const { handleCheckout } = useCheckout();

  const softwareType = form.watch("software_type");
  const turnaroundTime = form.watch("turnaround_time");
  const darkroomFile = form.watch("darkroom_file");

  useEffect(() => {
    // Check for reused order data in localStorage
    const reuseOrderData = localStorage.getItem('reuseOrder');
    if (reuseOrderData) {
      try {
        const orderData = JSON.parse(reuseOrderData) as Partial<OrderFormValues>;
        console.log("Pre-populating form with order data:", orderData);
        
        // Set each field individually to ensure proper type handling
        if (orderData.event_name) form.setValue("event_name", orderData.event_name);
        if (orderData.software_type) form.setValue("software_type", orderData.software_type);
        if (orderData.dimensions) form.setValue("dimensions", orderData.dimensions);
        if (orderData.turnaround_time) form.setValue("turnaround_time", orderData.turnaround_time);
        if (orderData.details) form.setValue("details", orderData.details);
        if (orderData.photo_boxes) form.setValue("photo_boxes", orderData.photo_boxes);
        if (orderData.darkroom_file !== undefined) form.setValue("darkroom_file", orderData.darkroom_file);
        if (orderData.email) form.setValue("email", orderData.email);
      } catch (error) {
        console.error("Error parsing reused order data:", error);
      }
      // Clear the localStorage after using the data
      localStorage.removeItem('reuseOrder');
    }
  }, [form]);

  const totalPrice = useMemo(() => {
    if (!softwareType || !turnaroundTime) return 0;
    return calculateOrderPrice(softwareType, turnaroundTime, darkroomFile);
  }, [softwareType, turnaroundTime, darkroomFile]);

  const onCheckout = async (values: OrderFormValues) => {
    await handleCheckout(values, totalPrice);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onCheckout)} className="space-y-6">
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