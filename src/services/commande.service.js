// services/commande.service.js
import { axiosInstance } from "../api/axiosInstance";

const listerCommandes = async () => {
  return await axiosInstance.get("/api/commande/boutique");
};

export const commandeService = {
  listerCommandes
};
