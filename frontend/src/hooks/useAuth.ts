'use client';
import { useState, useEffect } from 'react';
import { getStoredRole, getStoredToken } from '@/lib/auth-storage';

export function useAuth() {
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const [storedRole, storedToken] = await Promise.all([getStoredRole(), getStoredToken()]);
      setRole(storedRole?.toLowerCase() || null);
      setToken(storedToken);
      setLoading(false);
    };

    void bootstrapAuth();
  }, []);

  return { role, token, loading };
}
