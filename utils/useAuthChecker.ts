import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export function useAuthChecker() {
  const { session, loading: authLoading } = useAuth();
  const pathname = usePathname();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {

    if (!authLoading) {
      const isUserFullyAuthenticated = !!(session && !session.user.is_anonymous);
      setIsAuthenticated(isUserFullyAuthenticated);
 
      const needsRedirect = !isUserFullyAuthenticated && pathname !== '/login';
      setShouldRedirect(needsRedirect);

    } else {

      setIsAuthenticated(false);
      setShouldRedirect(false);
    }

  }, [session, authLoading, pathname]);

  return { isLoading: authLoading, isAuthenticated, shouldRedirect };
}
