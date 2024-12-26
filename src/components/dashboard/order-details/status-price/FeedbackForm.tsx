import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackFormProps {
  orderId: string;
  initialFeedback?: string;
}

export const FeedbackForm = ({ orderId, initialFeedback = "" }: FeedbackFormProps) => {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async () => {
    if (!orderId || !feedback.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide feedback before submitting",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting feedback for order:', orderId);
      const { error } = await supabase
        .from('orders')
        .update({
          preview_feedback: feedback,
          status: 'in_revision'
        })
        .eq('id', orderId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: "Feedback submitted",
        description: "Your feedback has been sent to the designer",
      });
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="space-y-2">
        <label htmlFor="feedback" className="text-sm font-medium">
          Provide Feedback
        </label>
        <Textarea
          id="feedback"
          placeholder="Enter your feedback about the preview..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <Button 
        onClick={handleSubmitFeedback}
        disabled={isSubmitting || !feedback.trim()}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </div>
  );
};