import { create } from "zustand";
import { deviceTokenService } from "../services/deviceToken.service";

const useDeviceTokenStore = create((set) => ({
    loading: false,
    error: null,
    success: false,

    registerDeviceToken: async (hashid, deviceToken) => {
        set({ loading: true, error: null, success: false });
        
        try {
            const response = await deviceTokenService.registerDeviceToken(hashid, deviceToken);
            set({ loading: false, success: true });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            set({ error: errorMessage, loading: false, success: false });
            throw error;
        }
    },

    clearMessages: () => set({ error: null, success: false }),
}));

export default useDeviceTokenStore;