import { create } from "zustand";
import { authService } from "../services/auth.service";

const useResetPasswordBoutiqueStore = create((set) => ({
  step: 'email',
  email_btq: '',
  loading: false,
  error: null,
  success: false,
  otpVerified: false,

  setEmail: (email_btq) => set({ email_btq }),
  
  setStep: (step) => set({ step }),

  requestResetCode: async (email_btq) => {
    set({ loading: true, error: null, success: false });
    
    try {
      const response = await authService.requestPasswordResetBoutique(email_btq);
      
      if (response.data.success) {
        set({ 
          email_btq, 
          step: 'otp', 
          loading: false, 
          error: null 
        });
      } else {
        throw new Error(response.data.message || "Erreur lors de l'envoi du code");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Erreur lors de l'envoi du code de réinitialisation";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  verifyOtp: async (email_btq, otp) => {
    set({ loading: true, error: null });
    
    try {
      const response = await authService.verifyResetTokenBoutique(email_btq, otp);
      
      if (response.data.success) {
        set({ 
          otpVerified: true, 
          step: 'new-password', 
          loading: false, 
          error: null 
        });
      } else {
        throw new Error(response.data.message || "Code invalide");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Code de vérification invalide";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  submitNewPassword: async (email_btq, password, password_confirmation) => {
    set({ loading: true, error: null });
    
    try {
      const response = await authService.resetPasswordBoutique(email_btq, password, password_confirmation);
      
      if (response.data.success) {
        set({ 
          success: true, 
          loading: false, 
          error: null 
        });
      } else {
        throw new Error(response.data.message || "Erreur lors de la réinitialisation");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Erreur lors de la réinitialisation du mot de passe";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  clearState: () => set({
    step: 'email',
    email_btq: '',
    loading: false,
    error: null,
    success: false,
    otpVerified: false
  })
}));

export default useResetPasswordBoutiqueStore;