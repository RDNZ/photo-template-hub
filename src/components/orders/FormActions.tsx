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
      >
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting || isDisabled}>
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