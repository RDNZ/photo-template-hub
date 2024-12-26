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
    <div className="dashboard-header">
      <div className="dashboard-header-content">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="dashboard-header-title">Analytics Dashboard</h1>
          <div className="dashboard-header-buttons">
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="secondary"
              className="dashboard-header-button"
              size={isMobile ? "lg" : "default"}
            >
              <ClipboardList className="h-4 w-4" />
              View Orders
            </Button>
            <Button 
              onClick={onRefresh} 
              variant="secondary"
              className="dashboard-header-button"
              size={isMobile ? "lg" : "default"}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>
      <div className="h-3 bg-gradient-to-b from-brand-teal/20 to-transparent rounded-b-lg" />
    </div>
  );
};