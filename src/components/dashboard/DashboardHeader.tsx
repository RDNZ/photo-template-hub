import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/ProfileMenu";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  onNewOrder: () => void;
}

export const DashboardHeader = ({ onNewOrder }: DashboardHeaderProps) => (
  <div className="dashboard-header">
    <div className="dashboard-header-content">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="dashboard-header-title">My Orders</h1>
        <div className="flex items-center gap-4">
          <Button 
            onClick={onNewOrder}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white transition-colors rounded-lg px-4 py-2 font-medium flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Order
          </Button>
          <ProfileMenu />
        </div>
      </div>
    </div>
    <div className="h-3 bg-gradient-to-b from-brand-teal/20 to-transparent rounded-b-lg" />
  </div>
);