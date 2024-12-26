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
    <div className="bg-brand-teal rounded-lg mb-6">
      <div className="px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Button 
              onClick={() => navigate('/analytics')} 
              variant="secondary"
              className="flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-brand-teal transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
            <Button 
              onClick={onRefresh} 
              variant="secondary"
              className="flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-brand-teal transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
            <Button 
              onClick={handleSignOut} 
              variant="secondary"
              className="flex items-center justify-center gap-2 bg-white/90 hover:bg-white text-brand-teal transition-colors"
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