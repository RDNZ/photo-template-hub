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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-brand-teal/10 to-transparent p-6 rounded-xl mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-brand-gray-dark">Admin Dashboard</h1>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <Button 
          onClick={() => navigate('/analytics')} 
          variant="outline"
          className="flex items-center justify-center gap-2 h-10 px-4 hover:bg-brand-teal hover:text-white transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Button>
        <Button 
          onClick={onRefresh} 
          variant="outline"
          className="flex items-center justify-center gap-2 h-10 px-4 hover:bg-brand-teal hover:text-white transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
        <Button 
          onClick={handleSignOut} 
          variant="outline"
          className="flex items-center justify-center gap-2 h-10 px-4 hover:bg-brand-teal hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};