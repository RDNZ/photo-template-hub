import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrderForm } from "@/components/orders/OrderForm";
import { type OrderFormValues, type OrderData } from "@/lib/schemas/orderSchema";
import { calculateOrderPrice } from "@/lib/utils/priceCalculator";

const NewOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "client") {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (values: OrderFormValues) => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const price = calculateOrderPrice(values.software_type, values.turnaround_time);

      const orderData: OrderData = {
        event_name: values.event_name,
        software_type: values.software_type,
        dimensions: values.dimensions,
        turnaround_time: values.turnaround_time,
        price,
        user_id: session.user.id,
        darkroom_file: values.darkroom_file,
        photo_boxes: values.photo_boxes,
      };

      const { error } = await supabase.from("orders").insert(orderData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your order has been submitted successfully",
      });
      navigate("/client-dashboard");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New Order</h1>
          <p className="text-muted-foreground mt-2">
            Please fill out the form below to submit a new order
          </p>
        </div>

        <OrderForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => navigate("/client-dashboard")}
        />
      </div>
    </div>
  );
};

export default NewOrder;