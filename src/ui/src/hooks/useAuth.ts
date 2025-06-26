// src/ui/src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error?: Error; // Not used in this basic hook, but could be extended
}

const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setAuthState({ user, loading: false });
      },
      (error) => {
        // This error callback is for issues with the listener itself, not login/signup errors
        console.error("Auth state listener error:", error);
        setAuthState({ user: null, loading: false, error });
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return authState;
};

export default useAuth;
