import { Button } from "@/components/ui/button";
import { RefreshCw, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AnalyticsHeaderProps {
  onRefresh: () => void;
}

export const AnalyticsHeader = ({ onRefresh }: AnalyticsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      <div className="flex items-center gap-4">
        <Button 
          onClick={() => navigate('/dashboard')} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <ClipboardList className="h-4 w-4" />
          View Orders
        </Button>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};