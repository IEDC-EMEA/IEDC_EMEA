import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/useAuth"; // Assuming your auth context is exported from here
import { Loader } from "lucide-react";

interface AuthRoleRequireProps {
  role?: "admin" | "user";
  children: JSX.Element;
}

const AuthRoleRequire: React.FC<AuthRoleRequireProps> = ({ role, children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the user role from Supabase metadata or user_metadata
        if (user) {
          // Option 1: Check user_metadata (set during signup or update)
          const metadataRole = user.user_metadata?.role;
          
          // Option 2: You can also fetch from a profiles table if you have one
          // const { data: profile } = await supabase
          //   .from('profiles')
          //   .select('role')
          //   .eq('id', user.id)
          //   .single();
          
          setUserRole(metadataRole || 'user'); // Default to 'user' if no role specified
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-white dark:bg-slate-900 flex items-center justify-center z-50">
        <p className="text-center dark:text-white flex items-center justify-center">
          <Loader className="animate-spin h-8 w-8 text-gray-400 dark:text-white text-lg mx-2" />
          Loading...
        </p>
      </div>
    );
  }

  // If no user is authenticated, redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If role is specified and user doesn't have it, redirect to unauthorized page
  if (role && userRole !== role) {
    // You can redirect to an unauthorized page or back to signin
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is authenticated and has the required role (if specified)
  return children;
};

export default AuthRoleRequire;