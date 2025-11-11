// ✅ axiosInstance.js
import axios from "axios";
import { API_URL } from "./config";
import toast from "react-hot-toast";

// Création de l'instance Axios
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false, // ⚙️ Désactiver l'envoi automatique des cookies (utile pour API JWT)
  timeout: 15000, // ⏱️ Timeout global (15s)
});

// ✅ Intercepteur de requêtes (ajout du token automatiquement)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug facultatif (à désactiver en prod)
    if (import.meta.env.MODE === "development") {
      console.log(`➡️ [${config.method?.toUpperCase()}] ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error("❌ Erreur d'interception (requête):", error);
    return Promise.reject(error);
  }
);

// ✅ Intercepteur de réponses (gestion des erreurs globales)
axiosInstance.interceptors.response.use(
  (response) => {
    // Debug facultatif
    if (import.meta.env.MODE === "development") {
      console.log(`✅ Réponse de ${response.config.url}`, response.data);
    }

    return response;
  },
  (error) => {
    // Erreur réseau (pas de réponse du serveur)
    if (!error.response) {
      toast.error("⚠️ Impossible de contacter le serveur. Vérifie ta connexion Internet.");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const errorMessage =
      error.response.data?.message ||
      `Erreur inattendue (${status})`;

    // Gestion de quelques cas particuliers
    switch (status) {
      case 400:
        toast.error("❌ Requête invalide");
        break;
      case 401:
        toast.error("⛔ Session expirée, reconnecte-toi");
        // Supprime le token expiré
        localStorage.removeItem("token");
        // Redirige vers la page de login (si besoin)
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        break;
      case 403:
        toast.error("🚫 Accès refusé");
        break;
      case 404:
        toast.error("🔍 Ressource non trouvée");
        break;
      case 500:
        toast.error("💥 Erreur serveur");
        break;
      default:
        toast.error(errorMessage);
    }

    console.error("❌ Erreur API:", error.response);
    return Promise.reject(error);
  }
);