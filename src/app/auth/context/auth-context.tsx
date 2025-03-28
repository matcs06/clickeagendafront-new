"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // Import useRouter
import api from "@/api/api";

interface AuthContextType {
  access_token: string | null;
  user_id: string | null;
  name: string | null;
  user_name:string | null
  business_name: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  authenticateWithGoogle: (user_name:string, token:string, user_id:string, name:string) => void;
  refreshToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [access_token, setToken] = useState<string | null>(Cookies.get("token") ?? null);
  const [user_id, setUserId] = useState<string | null>(Cookies.get("user_id") ?? null);
  const [name, setName] = useState<string | null>(Cookies.get("name") ?? null);
  const [business_name, setBusinessName] = useState<string | null>(Cookies.get("business_name") ?? null);
  const [user_name, setUserName] = useState<string | null>(Cookies.get("user_name") ?? null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUserId = Cookies.get("user_id");
    const storedName = Cookies.get("name");
    const storedUserName = Cookies.get("user_name");

    const storedBusinessName = Cookies.get("business_name");
    if (storedUserId) setUserId(storedUserId);
    if (storedToken) setToken(storedToken);
    if (storedName) setName(storedName);
    if (storedUserName) setName(storedUserName);

    if (storedBusinessName) setBusinessName(storedBusinessName);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post("/sessions", { username, password });

      if (!response.data) throw new Error("Invalid credentials");

      const data = await response.data;
      Cookies.set("token", data.access_token, { expires: 7 }); // Stores token for 7 days
      Cookies.set("user_id", data.user.user_id, { expires: 7 }); // Store user_id
      Cookies.set("name", data.user.name, { expires: 7 }); // Store user_name
      Cookies.set("user_name", data.user.user_name, { expires: 7 }); // Store user_name

      Cookies.set("business_name", data.user.business_name, { expires: 7 }); // Store business_name

      setToken(data.access_token);
      return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await api.post("/refresh/token", {}, { withCredentials: true });
  
      // Set token to expire in 15 minutes
      Cookies.set("token", response.data.access_token, { expires: 1 / 96 }); // 1/96 of a day = 15 minutes
  
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  const logout = () => {
    // Clear authentication data
    Cookies.remove("token");
    Cookies.remove("user_id");
    Cookies.remove("name");
    Cookies.remove("business_name");
    Cookies.remove("user_name");
    setName(null);
    setBusinessName(null);
    setToken(null);
    setUserId(null);
    setUserName(null)
    router.push("/login");

  };

  const authenticateWithGoogle = async (user_name:string, token:string, user_id:string, name:string)  => { 
    Cookies.set("token", token, { expires: 7 }); // Stores token for 7 days
    Cookies.set("user_id", user_id, { expires: 7 }); // Store user_id
    Cookies.set("name", name, { expires: 7 }); // Store user_name
    Cookies.set("user_name", user_name, { expires: 7 }); // Store user_name
             
  };

  return (
    <AuthContext.Provider value={{ user_name,access_token, user_id, name, business_name, login, logout, authenticateWithGoogle, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
