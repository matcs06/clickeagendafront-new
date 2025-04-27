"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "../context/auth-context";
import api from "@/api/api";
import { OrbitProgress } from "react-loading-indicators";
export default function GoogleCallback() {
  const router = useRouter();
  const { authenticateWithGoogle } = useAuth();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const id_token = hashParams.get("id_token");

    if (id_token) {
      const storedNonce = sessionStorage.getItem("google_nonce");

      if (storedNonce) {
        const decodedToken = JSON.parse(atob(id_token.split(".")[1]));  // Decode the JWT payload
        const tokenNonce = decodedToken.nonce;

        if (tokenNonce === storedNonce) {
          console.log("Nonce matches, authentication successful");
          // Proceed with handling the user (e.g., send id_token to your backend)
        } else {
          console.error("Nonce mismatch. Security error.");
          toast.error("Nonce mismatch. Security error.");
          // Handle the error (e.g., show an error message)
          return;
        }
      }

      // Send the token to your backend for verification
      api.post("/sessions/google", { google_id_token: id_token }, {withCredentials: true})
      .then((response) => {
        const { access_token, user } = response.data;

        if (access_token && user) {
          // Call your authenticateWithGoogle function with the necessary fields
          authenticateWithGoogle(user, access_token);

          // Redirect to the dashboard
          router.push("/admin/pages/dashboard");
        } else {
          toast.error("Authentication failed");
        }
      })
      .catch(() => {
        toast.error("An error occurred during authentication.");
      });

    } else {
      toast.error("Google login failed!");
    }
  }, [router, authenticateWithGoogle]);

  return(
      <div className="col-span-full flex justify-center">
          <OrbitProgress dense color="#3d4e3d" size="small" text="" textColor="#7e4e4e" />          
      </div>
 
  ) 

}
