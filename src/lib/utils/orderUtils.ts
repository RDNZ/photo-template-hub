import { supabase } from "@/integrations/supabase/client";
import { OrderFormValues } from "@/lib/schemas/orderSchema";

export const createOrder = async (values: OrderFormValues, totalPrice: number, userId: string) => {
  console.log("Creating order with values:", {
    userId,
    eventName: values.event_name,
    price: totalPrice,
    details: values.details
  });

  if (!userId) {
    throw new Error("User ID is required to create an order");
  }

  const orderData = {
    user_id: userId,
    event_name: values.event_name,
    software_type: values.software_type,
    dimensions: values.dimensions,
    turnaround_time: values.turnaround_time,
    price: totalPrice,
    status: 'pending',
    details: values.details || null,
    photo_boxes: values.photo_boxes,
    darkroom_file: values.darkroom_file,
    reference_images: values.reference_images || []
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", {
      error: orderError,
      data: orderData
    });
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  if (!order) {
    throw new Error("Order was not created");
  }

  console.log("Order created successfully:", order);
  return order;
};

export const deleteOrder = async (orderId: string) => {
  console.log("Attempting to delete pending order:", orderId);
  
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) {
    console.error("Error deleting order:", error);
    throw new Error(`Failed to delete order: ${error.message}`);
  }

  console.log("Successfully deleted order:", orderId);
};