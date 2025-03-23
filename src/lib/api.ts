import Cookies from "js-cookie";

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
   const token = Cookies.get("token");
   const user_id = Cookies.get("user_id");
 
   // Construct headers
   const headers: HeadersInit = {
     "Content-Type": "application/json",
     ...(token ? { Authorization: `Bearer ${token}` } : {}),
     ...options.headers, // Merge any custom headers
   };
 
   // Append user_id to the endpoint if required
   const url = user_id && !endpoint.includes("sessions") // Skip for login
     ? `${endpoint}${endpoint.includes("?") ? "&" : "?"}user_id=${user_id}`
     : endpoint;
 
   const response = await fetch(`https://clickeagenda.arangal.com/${url}`, {
     ...options,
     headers,
   });
 
   if (!response.ok) throw new Error("Erro na requisição");
 
   // Return only the data (parsed JSON) from the response
  const data = await response.json();
  return data;
 };