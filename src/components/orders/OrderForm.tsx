import { useMemo } from "react";
import { Form } from "@/components/ui/form";
import { OrderFormValues } from "@/lib/schemas/orderSchema";
import { OrderFormFields } from "./OrderFormFields";
import { PriceDisplay } from "./PriceDisplay";
import { FormActions } from "./FormActions";
import { calculateOrderPrice } from "@/lib/utils/priceCalculator";
import { useOrderForm } from "@/hooks/useOrderForm";
import { useCheckout } from "@/hooks/useCheckout";
import { Card } from "@/components/ui/card";

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

  const totalPrice = useMemo(() => {
    if (!softwareType || !turnaroundTime) return 0;
    return calculateOrderPrice(softwareType, turnaroundTime, darkroomFile);
  }, [softwareType, turnaroundTime, darkroomFile]);

  const onCheckout = async (values: OrderFormValues) => {
    await handleCheckout(values, totalPrice);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onCheckout)} className="space-y-8">
        <Card className="p-6 md:p-8">
          <OrderFormFields form={form} />
        </Card>
        
        <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t z-10 p-6">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <PriceDisplay price={totalPrice} />
            <FormActions 
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              isDisabled={totalPrice === 0}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};