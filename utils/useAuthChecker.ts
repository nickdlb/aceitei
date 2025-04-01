import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

/**
 * Checks authentication status.
 * Returns loading state, authentication status, and whether a redirect to login is needed.
 */
export function useAuthChecker() {
  const { session, loading: authLoading } = useAuth();
  const pathname = usePathname();
  // State reflects if user is fully authenticated *after* loading
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State indicates if a redirect should be performed by the component
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    // Only determine final state once auth loading is complete
    if (!authLoading) {
      const isUserFullyAuthenticated = !!(session && !session.user.is_anonymous);
      setIsAuthenticated(isUserFullyAuthenticated);

      // Determine if redirect is needed (not authenticated AND not already on login page)
      const needsRedirect = !isUserFullyAuthenticated && pathname !== '/login';
      setShouldRedirect(needsRedirect);

    } else {
      // While loading, assume not authenticated and no redirect needed yet
      setIsAuthenticated(false);
      setShouldRedirect(false);
    }
    // Effect depends on the auth state changing and the current path
  }, [session, authLoading, pathname]);

  // isLoading is directly the auth provider's loading state.
  // isAuthenticated reflects status after check.
  // shouldRedirect indicates if the consuming component should navigate.
  return { isLoading: authLoading, isAuthenticated, shouldRedirect };
}
