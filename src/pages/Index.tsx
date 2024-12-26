import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <div className="w-full max-w-md px-8">
          <Button
            variant="ghost"
            onClick={() => window.location.href = 'https://rdnz.design'}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to rdnz.design
          </Button>
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
            Error: {error}
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full bg-brand-teal hover:bg-brand-teal/90 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md px-8">
        <Button
          variant="ghost"
          onClick={() => window.location.href = 'https://rdnz.design'}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to rdnz.design
        </Button>
        
        <div className="bg-card rounded-lg border border-border shadow-sm p-8">
          <h1 className="text-2xl font-bold text-center mb-2 text-brand-gray-dark">
            Photo Booth Template Dashboard
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            Sign in to manage your photo booth template orders and settings
          </p>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3AAFA9',
                    brandAccent: '#F25F43',
                    brandButtonText: 'white',
                    defaultButtonBackground: '#FAFAFA',
                    defaultButtonBackgroundHover: '#F5F5F5',
                    inputBackground: 'white',
                    inputBorder: '#E5E7EB',
                    inputBorderHover: '#3AAFA9',
                    inputBorderFocus: '#3AAFA9',
                  },
                  borderRadii: {
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'rounded-lg font-medium',
                input: 'rounded-lg border focus:ring-2 focus:ring-brand-teal focus:border-transparent',
                label: 'text-sm font-medium text-foreground',
              },
            }}
            providers={[]}
          />
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            By signing in, you agree to our{' '}
            <a href="#" className="text-brand-teal hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-brand-teal hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;