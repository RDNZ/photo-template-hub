import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Photo Booth Template Dashboard</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#404040',
                  brandAccent: '#262626',
                }
              }
            }
          }}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Index;