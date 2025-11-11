import { axiosInstance } from "../api/axiosInstance";

const listerCommandesBoutique = async () => {
  const response = await axiosInstance.get("/api/commande/boutique");
  return response; // Retourner la réponse complète, pas seulement response.data
};

export const commandeService = {
  listerCommandesBoutique
};