// ✅ axiosInstance.js
import axios from "axios";
import { API_URL } from "./config";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

//  Intercepteur pour ajouter automatiquement le token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//  Intercepteur pour gérer les erreurs de réponse et afficher des toasts
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Récupérer le message d'erreur de la réponse API ou utiliser un message par défaut
    const errorMessage =
      error.response?.data?.message ||
      "Une erreur est survenue lors de la requête";

    // Afficher le message d'erreur dans un toast
    toast.error(errorMessage);

    // Rejeter la promesse pour que le catch puisse toujours être utilisé
    return Promise.reject(error);
  }
);