import { axiosInstance } from "../api/axiosInstance";

const listerCommandesBoutique = async () => {
  const response = await axiosInstance.get("/api/commande/boutique");
  return response;
};

export const commandeService = {
  listerCommandesBoutique
};