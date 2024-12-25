import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/integrations/supabase/types/orders";
import { formatPrice, formatTurnaroundTime, getStatusBadgeVariant } from "../utils/tableFormatters";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderTableRowProps {
  order: Order;
  onClick: () => void;
  isAdmin?: boolean;
}

export const OrderTableRow = ({ order, onClick, isAdmin = false }: OrderTableRowProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      
      toast({
        title: "Status updated",
        description: `Order status changed to ${newStatus.replace(/_/g, ' ')}`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      });
    }
  };

  const handlePreviewUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Preview file must be less than 5MB",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${order.id}_preview.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('preview_images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('preview_images')
        .getPublicUrl(fileName);

      // Update order with preview URL and status
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          preview_image: publicUrl,
          status: 'preview_ready'
        })
        .eq('id', order.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      
      toast({
        title: "Success",
        description: "Preview uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading preview:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload preview image",
      });
    } finally {
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50" 
      onClick={(e) => {
        // Prevent row click when clicking on status select or file input
        if ((e.target as HTMLElement).closest('.status-select, .preview-upload')) {
          e.stopPropagation();
          return;
        }
        onClick();
      }}
    >
      {isAdmin && (
        <>
          <TableCell className="border-r border-muted/30">{order.profiles?.name || 'Unknown'}</TableCell>
          <TableCell className="border-r border-muted/30">{order.profiles?.email || 'Unknown'}</TableCell>
        </>
      )}
      <TableCell className="border-r border-muted/30">{order.event_name}</TableCell>
      <TableCell className="border-r border-muted/30">{order.software_type.replace(/_/g, ' ')}</TableCell>
      <TableCell className="border-r border-muted/30">{order.dimensions}</TableCell>
      <TableCell className="border-r border-muted/30">{order.photo_boxes}</TableCell>
      <TableCell className="border-r border-muted/30">{order.darkroom_file ? 'Yes' : 'No'}</TableCell>
      <TableCell className="border-r border-muted/30">{formatTurnaroundTime(order.turnaround_time)}</TableCell>
      <TableCell className="border-r border-muted/30 max-w-[200px] truncate" title={order.details || ''}>
        {order.details || '-'}
      </TableCell>
      <TableCell className="border-r border-muted/30">{formatPrice(order.price)}</TableCell>
      <TableCell>
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <div className="status-select">
              <Select
                defaultValue={order.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="preview_ready">Preview Ready</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {order.status === 'in_progress' && (
              <div className="preview-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePreviewUpload}
                  className="hidden"
                  id={`preview-upload-${order.id}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById(`preview-upload-${order.id}`)?.click();
                  }}
                >
                  <Upload className="h-4 w-4" />
                  Upload Preview
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Badge variant={getStatusBadgeVariant(order.status)}>
            {order.status.replace(/_/g, ' ')}
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
};