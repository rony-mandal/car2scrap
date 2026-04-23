import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, isAdmin, isAdminLoading } = useAuth();

  if (loading || (session && isAdminLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2 font-[Poppins]">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            Your account is signed in but does not have admin privileges.
          </p>
          <p className="text-xs text-muted-foreground">
            Ask the existing admin to grant you the admin role.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
