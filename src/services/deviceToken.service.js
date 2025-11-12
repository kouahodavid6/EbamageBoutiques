import { axiosInstance } from "../api/axiosInstance";

export const deviceTokenService = {
    async registerDeviceToken(hashid, deviceToken) {
        try {
            const response = await axiosInstance.post('/api/device/token', {
                hashid: hashid,
                device_token: deviceToken
            });
            
            console.log('✅ Device token enregistré avec succès:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Erreur lors de l\'enregistrement du device token:', error);
            throw error;
        }
    }
};