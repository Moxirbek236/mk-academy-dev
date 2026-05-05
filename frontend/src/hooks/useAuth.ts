'use client';
import { useState, useEffect } from 'react';
import {
  getStoredAuthSnapshot,
  getStoredRole,
  getStoredToken,
  subscribeAuthChange,
} from '@/lib/auth-storage';

export function useAuth() {
  const snapshot = getStoredAuthSnapshot();
  const [role, setRole] = useState<string | null>(snapshot.role?.toLowerCase() || null);
  const [token, setToken] = useState<string | null>(snapshot.token);
  const [loading, setLoading] = useState(
    snapshot.canResolveSynchronously ? false : true,
  );

  useEffect(() => {
    let active = true;

    const syncAuth = async () => {
      if (active) {
        setLoading(true);
      }
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
