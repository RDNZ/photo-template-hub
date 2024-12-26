import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

export const ErrorMessage = ({ error, onRetry }: ErrorMessageProps) => (
  <div className="w-full max-w-md px-8">
    <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
      Error: {error}
    </div>
    <Button 
      onClick={onRetry} 
      className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white"
    >
      Retry
    </Button>
  </div>
);