import { Order } from "@/integrations/supabase/types/orders";

interface OrderBasicInfoProps {
  order: Order;
}

export const OrderBasicInfo = ({ order }: OrderBasicInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold mb-2">Event Details</h3>
        <div className="space-y-2">
          <p><span className="text-muted-foreground">Event Name:</span> {order.event_name}</p>
          <p><span className="text-muted-foreground">Software Type:</span> {order.software_type.replace(/_/g, ' ')}</p>
          <p><span className="text-muted-foreground">Dimensions:</span> {order.dimensions}</p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Order Specifications</h3>
        <div className="space-y-2">
          <p><span className="text-muted-foreground">Photo Boxes:</span> {order.photo_boxes}</p>
          <p><span className="text-muted-foreground">Darkroom File:</span> {order.darkroom_file ? 'Yes' : 'No'}</p>
          <p><span className="text-muted-foreground">Turnaround Time:</span> {order.turnaround_time}</p>
        </div>
      </div>
    </div>
  );
};