"use client";
import {jwtDecode} from "jwt-decode";

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
  refreshBeforeRequest: (token:string | undefined) => Promise<void>;
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
      const response = await api.post("/sessions", { username, password }, {withCredentials:true});

      if (!response.data) throw new Error("Invalid credentials");

      const data = await response.data;
      Cookies.set("token", data.access_token, { expires: 1 / 96 }); // 1/96 of a day = 15 minutes
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

  const refreshBeforeRequest = async (access_token:string | undefined) =>{
    // Case 1: Token is missing
    let refreshed;
    if (!access_token) {
      console.log("Token missing, refreshing...");
      refreshed = await refreshToken("token_expired");
      if (!refreshed) throw new Error("User not authenticated");
    }else{
      // Case 2: Token exists but is expired
      if (isTokenExpired(access_token)) {
        console.log("Token expired, refreshing...");
        const refreshed = await refreshToken("token_expired");
        if (!refreshed) throw new Error("User not authenticated");
      }
    }
    
  }

  const isTokenExpired = (token: string) => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      return decoded.exp * 1000 < Date.now(); // Convert `exp` to milliseconds and compare
    } catch {
      return true; // If decoding fails, treat it as expired
    }
  };

  const refreshToken = async (error: string) => {
    console.log("Token expirado, tentando atualizar...")
    if(error == "token_expired"){
      try {
        const response = await api.post("/tokens/refresh", {}, { withCredentials: true });
        // Set token to expire in 15 minutes
        const newToken = response.data.access_token;
        if (newToken) {
          Cookies.set("token", newToken, { expires: 1 / 96 }); // 1/96 of a day = 15 minutes
          console.log("token atualizado com sucesso")
          return true;
        }
       
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }
    return false
   };

  const logout = async () => {
    // Clear authentication data

    await api.post("tokens/logout", {}, {withCredentials: true})

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
    Cookies.set("token", token, { expires: 1 / 96 }); // 1/96 of a day = 15 minutes
    Cookies.set("user_id", user_id, { expires: 7 }); // Store user_id
    Cookies.set("name", name, { expires: 7 }); // Store user_name
    Cookies.set("user_name", user_name, { expires: 7 }); // Store user_name
             
  };

  return (
    <AuthContext.Provider value={{ user_name,access_token, user_id, name, business_name, login, logout, authenticateWithGoogle, refreshBeforeRequest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
