import { supabase } from "@/integrations/supabase/client";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

export const createOrder = async (values: OrderFormValues, totalPrice: number, userId: string) => {
  console.log("Creating order in database...");
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      event_name: values.event_name,
      software_type: values.software_type,
      dimensions: values.dimensions,
      turnaround_time: values.turnaround_time,
      price: totalPrice,
      status: 'pending',
      details: values.details,
      photo_boxes: values.photo_boxes,
      darkroom_file: values.darkroom_file,
      reference_images: values.reference_images
    })
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw new Error("Failed to create order");
  }

  console.log("Order created successfully:", order);
  return order;
};

export const deleteOrder = async (orderId: string) => {
  console.log("Deleting pending order:", orderId);
  await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);
};