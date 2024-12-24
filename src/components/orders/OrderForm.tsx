import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { orderFormSchema, type OrderFormValues } from "@/lib/schemas/orderSchema";
import { supabase } from "@/integrations/supabase/client";

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
      email: "",
    },
  });

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="event_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter event name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="software_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Software Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select software type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="photoshop">Photoshop ($50)</SelectItem>
                  <SelectItem value="illustrator">
                    Illustrator ($75)
                  </SelectItem>
                  <SelectItem value="after_effects">
                    After Effects ($100)
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dimensions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dimensions</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter dimensions (e.g., 1920x1080)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="turnaround_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Turnaround Time</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select turnaround time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="24h">24 Hours (+50%)</SelectItem>
                  <SelectItem value="48h">48 Hours (+25%)</SelectItem>
                  <SelectItem value="72h">72 Hours (Standard)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
};