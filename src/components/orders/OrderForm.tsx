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
      const orderData = JSON.parse(reuseOrderData);
      Object.entries(orderData).forEach(([key, value]) => {
        form.setValue(key as keyof OrderFormValues, value);
      });
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