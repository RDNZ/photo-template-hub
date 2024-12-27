import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const AuthCard = () => (
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
            }
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
      view="sign_in"
      showLinks={true}
      redirectTo={window.location.origin}
    />
    
    <p className="mt-6 text-center text-sm text-muted-foreground">
      By signing in, you agree to our{' '}
      <a href="#" className="text-brand-teal hover:underline">Terms of Service</a>
      {' '}and{' '}
      <a href="#" className="text-brand-teal hover:underline">Privacy Policy</a>
    </p>
  </div>
);