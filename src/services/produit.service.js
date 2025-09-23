import { axiosInstance } from "../api/axiosInstance";
import { API_URL } from "../api/config";
//import axios from "axios";

// CREATE
const ajouterProduit = async (formData) => {
  return await axiosInstance.post("/api/article/ajout", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// READ
const listerProduits = async () => {
  return await axiosInstance.get("/api/article/boutique", {
    headers: {
      Accept: "application/json",
    },
  });
};

// UPDATE
const updateProduit = async (hashid, formData) => {
  return await axiosInstance.post(`/api/article/${hashid}/update`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// DELETE
const deleteProduit = async (hashid) => {
  return await axiosInstance.delete(`/api/article/${hashid}/delete`);
};

// GET CATEGORIES
const getCategories = async () => {
  return await axiosInstance.get("/api/categories", {
    headers: {
      Accept: "application/json",
    },
  });
};

export const produitService = {
  ajouterProduit,
  listerProduits,
  updateProduit,
  deleteProduit,
  getCategories,
};
