"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // Import useRouter

interface AuthContextType {
  token: string | null;
  user_id: string | null;
  name: string | null;
  business_name: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(Cookies.get("token") ?? null);
  const [user_id, setUserId] = useState<string | null>(Cookies.get("user_id") ?? null);
  const [name, setName] = useState<string | null>(Cookies.get("name") ?? null);
  const [business_name, setBusinessName] = useState<string | null>(Cookies.get("business_name") ?? null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUserId = Cookies.get("user_id");
    const storedUserName = Cookies.get("name");
    const storedBusinessName = Cookies.get("business_name");
    if (storedUserId) setUserId(storedUserId);
    if (storedToken) setToken(storedToken);
    if (storedUserName) setName(storedUserName);
    if (storedBusinessName) setBusinessName(storedBusinessName);
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
      Cookies.set("name", data.user.name, { expires: 7 }); // Store user_name
      Cookies.set("business_name", data.user.business_name, { expires: 7 }); // Store business_name

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
    Cookies.remove("name");
    Cookies.remove("business_name");
    setName(null);
    setBusinessName(null);
    setToken(null);
    setUserId(null);
    router.push("/login");

  };

  return (
    <AuthContext.Provider value={{ token, user_id, name, business_name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
