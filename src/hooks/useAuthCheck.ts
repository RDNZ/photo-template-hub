import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("No session found, redirecting to login");
          navigate("/");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch user profile. Please try again.",
          });
          navigate("/");
          return;
        }

        if (!profile) {
          console.log("No profile found");
          navigate("/");
          return;
        }

        if (profile.role === 'admin') {
          console.log("Admin user detected, redirecting to admin dashboard");
          navigate("/dashboard");
          return;
        }

        if (profile.role !== "client") {
          console.log("User is not a client");
          navigate("/");
          return;
        }

        console.log("Client access confirmed");
        setIsAuthChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try logging in again.",
        });
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return isAuthChecking;
};