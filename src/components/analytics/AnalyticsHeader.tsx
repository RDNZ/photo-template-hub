import { Button } from "@/components/ui/button";
import { RefreshCw, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnalyticsHeaderProps {
  onRefresh: () => void;
}

export const AnalyticsHeader = ({ onRefresh }: AnalyticsHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Analytics Dashboard</h1>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <Button 
          onClick={() => navigate('/dashboard')} 
          variant="outline"
          className="flex items-center justify-center gap-2"
          size={isMobile ? "lg" : "default"}
        >
          <ClipboardList className="h-4 w-4" />
          View Orders
        </Button>
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size={isMobile ? "lg" : "sm"}
          className="flex items-center justify-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};