import { axiosInstance } from "../api/axiosInstance";

// Récupérer les commandes de la boutique
const listerCommandes = async () => {
  return await axiosInstance.get("/api/commande/boutique", {
    headers: {
      "Accept": "application/json",
    },
  });
};

export const commandeService = {
  listerCommandes
};