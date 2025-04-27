"use client";
import {jwtDecode} from "jwt-decode";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // Import useRouter
import api from "@/api/api";

interface AuthContextType {
  access_token: string | null;
  user_id: string | null; 
  login: (username_or_email: string, password: string) => Promise<"true" | "false" | "verifyemail">;
  logout: () => void;
  signUp: (name:string, user_name: string, email:string, password:string) => Promise<boolean>;
  authenticateWithGoogle: (user: User, token: string) => void;
  refreshBeforeRequest: (token:string | undefined) => Promise<void>;
  updateAddInfo: (business_name:string, phone:string, address:string, welcome_message:string) => Promise<boolean>
  getUserInfo: ()=> {user_id: string | null, name: string | null, email: string | null, business_name: string | null, user_name: string | null, stripeSubscriptionId: string | null, planExpiresAt: Date | null}
}

interface User {
  business_name: string;
  welcome_message: string;
  phone: string;
  address: string;
  stripeSubscriptionId: string;
  planExpiresAt: Date;
  user_id: string
  name: string;
  email: string;
  username: string;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [access_token, setToken] = useState<string | null>(Cookies.get("token") ?? null);
  const [user_id, setUserId] = useState<string | null>(Cookies.get("user_id") ?? null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUserId = Cookies.get("user_id");
    if (storedUserId) setUserId(storedUserId);
    if (storedToken) setToken(storedToken);
    
  }, []);

  const updateAddInfo = async (business_name:string, phone:string, address:string, welcome_message:string) =>{
   
    try {

      const storedUserName = Cookies.get("user_name");
      const storedToken = Cookies.get("token");

      await api.patch("/users", 
        { username: storedUserName, phone, welcome_message, business_name, address }, 
        { withCredentials: true, headers: { Authorization: `Bearer ${storedToken}` } }
      )

      Cookies.set("business_name", business_name); // Store business_name
      Cookies.set("phone", phone)
      return true
    } catch  {
      return false
    }
  }

  const login = async (username_or_email: string, password: string) => {
    try {
      const response = await api.post("/sessions", { username_or_email, password }, {withCredentials:true});

      if (!response.data) throw new Error("Invalid credentials");

      if(response.data.user.email !== null){
      
        if(!response.data.user.is_verified){
          return "verifyemail"
        }
      }
    
      const data = await response.data;
      Cookies.set("token", data.access_token, { expires: 1 / 96 }); // 1/96 of a day = 15 minutes
      Cookies.set("user_id", data.user.user_id); // Store user_id
      Cookies.set("name", data.user.name); // Store user_name
      Cookies.set("user_name", data.user.username); // Store user_name
      Cookies.set("email", data.user.email)
      Cookies.set("business_name", data.user.business_name); // Store business_name
      Cookies.set("phone", data.user.phone)
      Cookies.set("address", data.user.address)
      Cookies.set("stripeSubscriptionId", data.user.stripeSubscriptionId)
      Cookies.set("planExpiresAt",String(data.user.planExpiresAt))
      setToken(data.access_token);
      return "true";
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "false";
    }
  };

  const signUp = async(name:string, user_name: string, email:string, password:string): Promise<boolean> =>{
    try {
      await api.post("/users", { name, username: user_name, email, password }, {withCredentials:true});
      return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }

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
    Cookies.remove("email")
    Cookies.remove("phone")
    Cookies.remove("address")
    Cookies.remove("stripeSubscriptionId")
    Cookies.remove("planExpiresAt")
    Cookies.remove("welcome_message")

    setToken(null);
    setUserId(null);
    router.push("/login");

  };

  const authenticateWithGoogle = async (user: User, token:string)  => { 
    Cookies.set("token", token, { expires: 1 / 96 }); // 1/96 of a day = 15 minutes
    Cookies.set("user_id", user.user_id); // Store user_id
    Cookies.set("name", user.name); // Store user_name
    Cookies.set("user_name", user.username); // Store user_name
    Cookies.set("email", user.email )
    Cookies.set("stripeSubscriptionId", user.stripeSubscriptionId)
    Cookies.set("planExpiresAt",String(user.planExpiresAt))
    Cookies.set("address", user.address)
    Cookies.set("phone", user.phone)
    Cookies.set("business_name", user.business_name); // Store business_name
    Cookies.set("welcome_message", user.welcome_message)
    setToken(token);

  };

  // Function to fetch user data from cookies
  const getUserInfo = () => ({
    user_id: Cookies.get("user_id") ?? null,
    name: Cookies.get("name") ?? null,
    email: Cookies.get("email") ?? null,
    business_name: Cookies.get("business_name") ?? null,
    user_name: Cookies.get("user_name") ?? null,
    stripeSubscriptionId: Cookies.get("stripeSubscriptionId") ?? null,
    planExpiresAt: Cookies.get("planExpiresAt") ? new Date(Cookies.get("planExpiresAt")!) : null
  });

  return (
    <AuthContext.Provider value={{ access_token, user_id, login, signUp, logout, authenticateWithGoogle, refreshBeforeRequest, updateAddInfo, getUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
