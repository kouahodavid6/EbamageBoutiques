import { axiosInstance } from "../api/axiosInstance";

const registerBoutique = async (userData) => {
  return axiosInstance.post("/api/register/boutique", userData);
};

const loginBoutique = async (credentials) => {
  return axiosInstance.post("/api/login/boutique", credentials);
};

export const authService = {
  registerBoutique,
  loginBoutique,
};