"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthSession,
  fetchCurrentUser,
  loadAuthSession,
  loginUser,
  logoutUser,
  registerUser,
  saveAuthSession,
  updateConnectProfile,
  type AccountType,
  type AuthUser,
} from "@/lib/api";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  accountType: AccountType;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  company: string;
  country: string;
  bio: string;
}

interface AuthContextType {
  user: AuthUser | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  isInitializing: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const persistSession = (
    nextAccessToken: string | null,
    nextCsrfToken: string | null,
    nextUser: AuthUser | null,
  ) => {
    if (!nextAccessToken) {
      clearAuthSession();
      return;
    }

    saveAuthSession({
      accessToken: nextAccessToken,
      csrfToken: nextCsrfToken,
      user: nextUser,
    });
  };

  const refreshUser = async () => {
    if (!accessToken) {
      return null;
    }

    const nextUser = await fetchCurrentUser(accessToken);
    setUser(nextUser);
    persistSession(accessToken, csrfToken, nextUser);
    return nextUser;
  };

  const login = async ({ email, password }: LoginInput) => {
    const session = await loginUser({ email, password });
    const nextUser = await fetchCurrentUser(session.accessToken);

    setAccessToken(session.accessToken);
    setCsrfToken(session.csrfToken ?? null);
    setUser(nextUser);
    persistSession(session.accessToken, session.csrfToken ?? null, nextUser);

    return nextUser;
  };

  const register = async (input: RegisterInput) => {
    await registerUser({
      accountType: input.accountType,
      fullName: input.fullName,
      email: input.email,
      password: input.password,
      phone: input.phone,
      dateOfBirth: input.dateOfBirth,
      country: input.country,
    });

    const session = await loginUser({
      email: input.email,
      password: input.password,
    });

    await updateConnectProfile(session.accessToken, {
      account_type: input.accountType,
      company: input.company,
      country: input.country,
      bio: input.bio,
    });

    const nextUser = await fetchCurrentUser(session.accessToken);
    setAccessToken(session.accessToken);
    setCsrfToken(session.csrfToken ?? null);
    setUser(nextUser);
    persistSession(session.accessToken, session.csrfToken ?? null, nextUser);

    return nextUser;
  };

  const logout = async () => {
    if (accessToken) {
      try {
        await logoutUser(accessToken);
      } catch {
        // Clear local state even if the backend logout call fails.
      }
    }

    setAccessToken(null);
    setCsrfToken(null);
    setUser(null);
    clearAuthSession();
  };

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      const session = loadAuthSession();
      if (!session?.accessToken) {
        if (!cancelled) {
          setIsInitializing(false);
        }
        return;
      }

      setAccessToken(session.accessToken);
      setCsrfToken(session.csrfToken ?? null);
      if (session.user) {
        setUser(session.user);
      }

      try {
        const nextUser = await fetchCurrentUser(session.accessToken);
        if (cancelled) {
          return;
        }
        setUser(nextUser);
        persistSession(session.accessToken, session.csrfToken ?? null, nextUser);
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setCsrfToken(null);
          setUser(null);
          clearAuthSession();
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoggedIn: !!user && !!accessToken,
        isInitializing,
        login,
        register,
        refreshUser,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
