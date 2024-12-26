import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export const FormActions = ({ onCancel, isSubmitting, isDisabled }: FormActionsProps) => {
  return (
    <div className="flex justify-between gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="border-brand-teal text-brand-teal hover:bg-brand-teal/10"
      >
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting || isDisabled}
        className="bg-brand-orange hover:bg-brand-orange/90 text-white"
      >
        {isSubmitting ? (
          "Processing..."
        ) : (
          <>
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};