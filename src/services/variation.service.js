import { axiosInstance } from "../api/axiosInstance";
import { API_URL } from "../api/config";

// get all variations set by super-admin
export const getVariations = async () => {
  return await axiosInstance.get("/api/variations", {
    headers: {
      Accept: "application/json",
    },
  });
};

// create variation shop
export const createVariationShop = async (data) => {
  return await axiosInstance.post("/api/ajout/libelles/variations", data, {
    headers: {
      Accept: "application/json",
    },
  });
};

// get variations shop
export const getVariationsShop = async () => {
  return await axiosInstance.get("/api/variations", {
    headers: {
      Accept: "application/json",
    },
  });
};

// update variation shop
export const updateVariationShop = async (data) => {
  return await axiosInstance.post("/api/variation/update", data, {
    headers: {
      Accept: "application/json",
    },
  });
};

// delete variation shop
export const deleteVariationShop = async (data) => {
  return await axiosInstance.post(`/api/variation/delete`, data, {
    headers: {
      Accept: "application/json",
    },
  });
};

// get variation shop by id
export const getVariationShopById = async (id) => {
  return await axiosInstance.get(`/api/variation/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
};
