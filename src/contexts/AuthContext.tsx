import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface CheckingAccountUser {
  id: string;
  email?: string;
  name?: string;
  country?: string;
  role?: string;
  emailVerified?: boolean;
  user_metadata?: Record<string, unknown>;
}

interface AuthContextType {
  user: (User | CheckingAccountUser) | null;
  session: Session | null;
  authToken: string | null;
  loading: boolean;
  setCheckingSession: (user: CheckingAccountUser, token?: string | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  authToken: null,
  loading: true,
  setCheckingSession: () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [checkingUser, setCheckingUser] = useState<CheckingAccountUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setSupabaseUser(nextSession?.user ?? null);
    });

    const hydrate = async () => {
      try {
        const [sbRes, apiRes] = await Promise.allSettled([
          supabase.auth.getSession(),
          fetch("/api/auth/me", { credentials: "include" }).then((r) => (r.ok ? r.json() : { user: null })),
        ]);

        if (!mounted) return;

        if (sbRes.status === "fulfilled") {
          setSession(sbRes.value.data.session);
          setSupabaseUser(sbRes.value.data.session?.user ?? null);
        }
        if (apiRes.status === "fulfilled" && apiRes.value?.user) {
          setCheckingUser(apiRes.value.user);
        }
      } catch {
        // Silent fallback when offline
      } finally {
        if (mounted) setLoading(false);
      }
    };

    hydrate();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const setCheckingSession = useCallback(
    (nextUser: CheckingAccountUser, token?: string | null) => {
      setCheckingUser(nextUser);
      if (token) setAuthToken(token);
      setLoading(false);
    },
    []
  );

  const signOut = useCallback(async () => {
    setCheckingUser(null);
    setAuthToken(null);
    await Promise.allSettled([
      supabase.auth.signOut(),
      fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
        headers: { "X-Requested-With": "CheckingAuth" },
      }),
    ]);
  }, []);

  const user = supabaseUser ?? checkingUser;

  return (
    <AuthContext.Provider
      value={{ user, session, authToken, loading, setCheckingSession, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
