import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/ProfileMenu";

interface ErrorStateProps {
  onRetry: () => void;
}

export const ErrorState = ({ onRetry }: ErrorStateProps) => (
  <div className="min-h-screen p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <ProfileMenu />
      </div>
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading orders. Please try again.</p>
        <Button onClick={onRetry} variant="outline">
          Retry
        </Button>
      </div>
    </div>
  </div>
);