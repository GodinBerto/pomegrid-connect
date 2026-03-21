import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "farmer" | "importer";

interface User {
  name: string;
  email: string;
  role: UserRole;
  company: string;
  country: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<UserRole, User> = {
  farmer: {
    name: "Alex Mwangi",
    email: "alex@greenvalley.co.ke",
    role: "farmer",
    company: "Green Valley Farms",
    country: "Kenya",
  },
  importer: {
    name: "Sophie Laurent",
    email: "sophie@eurofreshtrading.com",
    role: "importer",
    company: "EuroFresh Trading",
    country: "France",
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => setUser(mockUsers[role]);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
