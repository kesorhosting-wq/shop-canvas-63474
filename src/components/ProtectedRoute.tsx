import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { sb } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check initial session
    const checkAuth = async () => {
      const { data: { session } } = await sb.auth.getSession();
      setUser(session?.user ?? null);

      // Check if user is admin
      if (session?.user) {
        const { data: roleData } = await sb
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .single();
        
        setIsAdmin(!!roleData);
      }
      
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = sb.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        // Check admin role on auth change
        if (session?.user) {
          setTimeout(async () => {
            const { data: roleData } = await sb
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .eq("role", "admin")
              .single();
            
            setIsAdmin(!!roleData);
            setLoading(false);
          }, 0);
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
