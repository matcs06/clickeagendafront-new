import axios from "axios";
//  baseURL: "http://localhost:3333/",
const env = "prod";
const api = axios.create({
  baseURL: env === "prod" ? "https://api.clickeagenda.com.br" : "http://localhost:3001",
});

api.interceptors.response.use(
  response => response,
  error => {
    if (typeof window !== "undefined" && error.response?.status === 403 && error.response?.data?.message === "plan_expired_or_missing") {
      // Abrir modal usando custom event
      window.dispatchEvent(new Event("plan_expired_or_missing"));
    }

    return Promise.reject(error);
  }
);

export default api