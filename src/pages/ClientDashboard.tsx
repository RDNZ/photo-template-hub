import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/dashboard/LoadingSpinner";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { SuccessHandler } from "@/components/dashboard/SuccessHandler";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useClientOrders } from "@/hooks/useClientOrders";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const isAuthChecking = useAuthCheck();
  const { data: orders, isLoading, error, refetch } = useClientOrders(isAuthChecking);

  if (isAuthChecking) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  if (error) {
    console.error("Error in orders query:", error);
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader onNewOrder={() => navigate('/new-order')} />
        <SuccessHandler onSuccess={refetch} />
        {isLoading ? (
          <LoadingSpinner message="Loading orders..." />
        ) : (
          <OrdersTable orders={orders || []} />
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;