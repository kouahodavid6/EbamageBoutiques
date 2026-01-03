import { axiosInstance } from "../api/axiosInstance";

const registerBoutique = async (userData) => {
  return axiosInstance.post("/api/register/boutique", userData);
};

const loginBoutique = async (credentials) => {
  return axiosInstance.post("/api/login/boutique", credentials);
};

// NOUVEAU : Demande de réinitialisation pour boutique
const requestPasswordResetBoutique = async (email_btq) => {
  return axiosInstance.post("/api/demande/reinitialisation/password", {
    email: email_btq
  });
};

// NOUVEAU : Vérification OTP pour boutique
const verifyResetTokenBoutique = async (email_btq, otp) => {
  return axiosInstance.post("/api/verification/token/password", {
    email: email_btq,
    otp
  });
};

// NOUVEAU : Réinitialisation mot de passe boutique
const resetPasswordBoutique = async (email_btq, password, password_confirmation) => {
  return axiosInstance.post("/api/reinitialisation/password", {
    email: email_btq,
    password,
    password_confirmation
  });
};

export const authService = {
  registerBoutique,
  loginBoutique,
  requestPasswordResetBoutique,
  verifyResetTokenBoutique,
  resetPasswordBoutique
};