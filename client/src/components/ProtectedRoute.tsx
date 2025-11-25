import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { Redirect } from 'wouter';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}
