import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isDisabled: boolean;
}

export const FormActions = ({ onCancel, isSubmitting, isDisabled }: FormActionsProps) => {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting || isDisabled}>
        {isSubmitting ? "Processing..." : "Proceed to Checkout"}
      </Button>
    </div>
  );
};