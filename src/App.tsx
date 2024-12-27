import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { StrictMode, useEffect } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import NewOrder from "./pages/NewOrder";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
    },
  },
});

// Title updater component
const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitles: { [key: string]: string } = {
      "/": "Photo Template Hub",
      "/dashboard": "Dashboard | Photo Template Hub",
      "/client-dashboard": "My Dashboard | Photo Template Hub",
      "/new-order": "New Order | Photo Template Hub",
      "/profile": "Profile | Photo Template Hub",
      "/settings": "Settings | Photo Template Hub",
      "/analytics": "Analytics | Photo Template Hub",
    };

    document.title = pageTitles[location.pathname] || "Photo Template Hub";
  }, [location]);

  return null;
};

const App = () => {
  console.log("App component rendering"); // Added for debugging

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <TitleUpdater />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/new-order" element={<NewOrder />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;