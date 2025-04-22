import axios from "axios";
//  baseURL: "http://localhost:3333/",
const api = axios.create({
  baseURL: "https://api.clickeagenda.com.br",
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