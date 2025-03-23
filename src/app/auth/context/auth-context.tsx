"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // Import useRouter

interface AuthContextType {
  token: string | null;
  user_id: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(Cookies.get("token") ?? null);
  const [user_id, setUserId] = useState<string | null>(Cookies.get("user_id") ?? null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("https://clickeagenda.arangal.com/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      Cookies.set("token", data.token, { expires: 7 }); // Stores token for 7 days
      Cookies.set("user_id", data.user.user_id, { expires: 7 }); // Store user_id

      setToken(data.token);
      return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    // Clear authentication data
    Cookies.remove("token");
    Cookies.remove("user_id");
    setToken(null);
    setUserId(null);
    router.push("/login");

  };

  return (
    <AuthContext.Provider value={{ token,user_id, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
