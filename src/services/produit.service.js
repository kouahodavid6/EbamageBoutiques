import { axiosInstance } from "../api/axiosInstance";

const ajouterProduit = async (formData) => {
  return await axiosInstance.post("/api/article/ajout", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const listerProduits = async () => {
  const boutiqueHashId = localStorage.getItem("boutiqueHashId");

  if (!boutiqueHashId) {
    throw new Error("Aucun HashID de boutique trouvé. Veuillez vous reconnecter.");
  }

  return await axiosInstance.get("/api/article/boutique", {
    params: {
      boutiqueHashId: boutiqueHashId
    }
  });
};

const updateProduit = async (hashid, formData) => {
  return await axiosInstance.post(`/api/article/${hashid}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteProduit = async (hashid) => {
  return await axiosInstance.post(`/api/article/${hashid}/delete`);
};

const getCategories = async () => {
  return await axiosInstance.get("/api/categories");
};

export const produitService = {
  ajouterProduit,
  listerProduits,
  updateProduit,
  deleteProduit,
  getCategories,
};