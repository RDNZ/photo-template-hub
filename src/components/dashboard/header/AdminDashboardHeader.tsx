import { Button } from "@/components/ui/button";
import { BarChart3, RefreshCw, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdminDashboardHeaderProps {
  onRefresh: () => void;
}

export const AdminDashboardHeader = ({ onRefresh }: AdminDashboardHeaderProps) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="dashboard-header">
      <div className="dashboard-header-content">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="dashboard-header-title">Admin Dashboard</h1>
          <div className="dashboard-header-buttons">
            <Button 
              onClick={() => navigate('/analytics')} 
              variant="secondary"
              className="dashboard-header-button"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button 
              onClick={onRefresh} 
              variant="secondary"
              className="dashboard-header-button"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
            <Button 
              onClick={handleSignOut} 
              variant="secondary"
              className="dashboard-header-button"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      <div className="h-3 bg-gradient-to-b from-brand-teal/20 to-transparent rounded-b-lg" />
    </div>
  );
};