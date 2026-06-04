"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, LoginCredentials } from "@/types";
import { loginUser } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser && isMounted) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
      }
    } catch {
      if (isMounted) setUser(null);
    } finally {
      if (isMounted) setIsLoaded(true);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      const response = await loginUser(credentials);

      const user = {
        id: response.id,
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
        image: response.image,
      };

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  };

  const isAuthenticated = isLoaded && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated,
        isLoaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
