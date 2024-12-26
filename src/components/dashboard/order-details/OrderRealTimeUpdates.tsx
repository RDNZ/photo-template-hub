import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/integrations/supabase/types/orders";
import { useQueryClient } from "@tanstack/react-query";

interface OrderRealTimeUpdatesProps {
  orderId: string;
}

export const OrderRealTimeUpdates = ({ orderId }: OrderRealTimeUpdatesProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Setting up real-time subscription for order:", orderId);
    
    const channel = supabase
      .channel(`order_updates_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        async (payload) => {
          console.log("Received real-time update for order:", payload);
          
          // Immediately update the preview image in the cache
          const updatedOrder = payload.new as Order;
          if (updatedOrder.preview_image) {
            queryClient.setQueryData(['clientOrders'], (oldData: Order[] | undefined) => {
              if (!oldData) return oldData;
              return oldData.map(ord => 
                ord.id === updatedOrder.id ? { ...ord, preview_image: updatedOrder.preview_image } : ord
              );
            });
          }
          
          // Then invalidate queries to ensure full refresh
          await queryClient.invalidateQueries({ queryKey: ['clientOrders'] });
          await queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
          
          console.log("Queries invalidated after real-time update");
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);

  return null;
};