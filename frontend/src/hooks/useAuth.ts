'use client';
import { useState, useEffect } from 'react';
import { getCachedAuthSnapshot, getStoredRole, getStoredToken, subscribeAuthChange } from '@/lib/auth-storage';

export function useAuth() {
  const [role, setRole] = useState<string | null>(() => getCachedAuthSnapshot().role?.toLowerCase() || null);
  const [token, setToken] = useState<string | null>(() => getCachedAuthSnapshot().token);
  const [loading, setLoading] = useState(() => {
    const snapshot = getCachedAuthSnapshot();
    return !snapshot.token || !snapshot.role;
  });

  useEffect(() => {
    let active = true;

    const syncAuth = async () => {
      const [storedRole, storedToken] = await Promise.all([getStoredRole(), getStoredToken()]);
      if (!active) return;
      setRole(storedRole?.toLowerCase() || null);
      setToken(storedToken);
      setLoading(false);
    };

    void syncAuth();

    const unsubscribe = subscribeAuthChange(() => {
      void syncAuth();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { role, token, loading };
}
