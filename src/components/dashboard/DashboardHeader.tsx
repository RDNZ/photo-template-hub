import { Button } from "@/components/ui/button";
import { ProfileMenu } from "@/components/ProfileMenu";

interface DashboardHeaderProps {
  onNewOrder: () => void;
}

export const DashboardHeader = ({ onNewOrder }: DashboardHeaderProps) => (
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-3xl font-bold">My Orders</h1>
    <div className="flex items-center gap-4">
      <Button onClick={onNewOrder}>New Order</Button>
      <ProfileMenu />
    </div>
  </div>
);