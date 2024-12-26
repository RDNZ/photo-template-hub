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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-gray-dark">Admin Dashboard</h1>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <Button 
          onClick={() => navigate('/analytics')} 
          variant="outline"
          className="flex items-center justify-center gap-2 hover:bg-brand-teal hover:text-white"
        >
          <BarChart3 className="h-4 w-4 text-brand-teal" />
          Analytics
        </Button>
        <Button 
          onClick={onRefresh} 
          variant="outline"
          className="flex items-center justify-center gap-2 hover:bg-brand-teal hover:text-white"
        >
          <RefreshCw className="h-4 w-4 text-brand-teal" />
          Refresh Data
        </Button>
        <Button 
          onClick={handleSignOut} 
          variant="outline"
          className="flex items-center justify-center gap-2 hover:bg-brand-teal hover:text-white"
        >
          <LogOut className="h-4 w-4 text-brand-teal" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};