import { axiosInstance } from "../api/axiosInstance";

const getSoldeBoutique = async () => {
    try {
        const response = await axiosInstance.get('/api/solde/boutique');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du solde boutique');
    }
}

const reclamerDu = async (id_commande) => {
    try {
        const response = await axiosInstance.post('/api/reclammer/du', {
            id_commande: id_commande
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la réclamation du dû')
    }
}

export const boutiqueService = {
    getSoldeBoutique,
    reclamerDu
}