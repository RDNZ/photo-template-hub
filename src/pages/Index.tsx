import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BackToSiteButton } from "@/components/auth/BackToSiteButton";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoadingSpinner } from "@/components/auth/LoadingSpinner";
import { ErrorMessage } from "@/components/auth/ErrorMessage";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log("Starting auth check...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!mounted) {
          console.log("Component unmounted, stopping auth check");
          return;
        }

        if (session) {
          console.log("Session found, fetching profile...");
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (profileError) {
            console.error("Profile fetch error:", profileError);
            setError("Error fetching user profile");
            setIsLoading(false);
            return;
          }

          console.log("Profile found:", profile);
          if (profile?.role === "admin") {
            console.log("Redirecting to admin dashboard");
            navigate("/dashboard");
          } else if (profile?.role === "client") {
            console.log("Redirecting to client dashboard");
            navigate("/client-dashboard");
          } else {
            console.log("No role found, showing auth UI");
            setIsLoading(false);
          }
        } else {
          console.log("No session found, showing auth UI");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (!mounted) {
        console.log("Component unmounted, ignoring auth state change");
        return;
      }

      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, fetching profile...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          setError("Error fetching user profile");
          setIsLoading(false);
          return;
        }

        if (profile?.role === "admin") {
          navigate("/dashboard");
        } else if (profile?.role === "client") {
          navigate("/client-dashboard");
        } else {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <ErrorMessage error={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md px-8">
        <BackToSiteButton />
        <AuthCard />
      </div>
    </div>
  );
};

export default Index;