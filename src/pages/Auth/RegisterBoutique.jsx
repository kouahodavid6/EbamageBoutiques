import { Link, useNavigate } from "react-router-dom";
import ContainerForms from "./components/ContainerForms";
import Input from "../../components/Input";
import { ArrowLeft, Store, AlertCircle } from "lucide-react";
import { useState } from "react";
import useAuthStore from "../../stores/auth.store";

const RegisterBoutique = () => {
    const [formData, setFormData] = useState({
        nom_btq: "",
        email_btq: "",
        tel_btq: "",
        password_btq: ""
    });

    const { registerBoutique, error, clearError, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        try {
            const res = await registerBoutique(formData);
            console.log("Inscription réussie:", res);
            navigate("/dashboard-boutique");
        } catch (error) {
            // L'erreur est déjà gérée par l'intercepteur Axios
            console.error("Erreur lors de l'inscription :", error);
            // Pas besoin d'afficher un toast ici car l'intercepteur le fait déjà
        }
    };

    return (
        <ContainerForms>
            {/* Header */}
            <div className="w-full flex items-center justify-between py-4 px-1">
                <Link
                    to="/"
                    className="rounded-full p-1 flex items-center justify-center transition-colors bg-neutral-500 hover:bg-neutral-800"
                >
                    <ArrowLeft className="h-6 w-6 text-white" />
                </Link>
                <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center">
                    Inscription Boutique
                </h2>
                <Store className="h-7 w-7 text-pink-400" />
            </div>

            <p className="text-sm text-gray-600 text-center mb-6 px-4 sm:px-8">
                Digitalisez votre commerce dès maintenant avec TDL.
            </p>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Nom boutique */}
                <div>
                    <label htmlFor="nom_btq" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de la boutique <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        id="nom_btq"
                        name="nom_btq"
                        value={formData.nom_btq}
                        onChange={handleChange}
                        placeholder="Ma Super Boutique"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            error?.nom_btq ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                    {error?.nom_btq && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {error.nom_btq}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email_btq" className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="email"
                        id="email_btq"
                        name="email_btq"
                        value={formData.email_btq}
                        onChange={handleChange}
                        placeholder="contact@ma-boutique.com"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            error?.email_btq ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                    {error?.email_btq && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {error.email_btq}
                        </p>
                    )}
                </div>

                {/* Téléphone */}
                <div>
                    <label htmlFor="tel_btq" className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="text"
                        id="tel_btq"
                        name="tel_btq"
                        value={formData.tel_btq}
                        onChange={handleChange}
                        placeholder="0101010101"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            error?.tel_btq ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                    {error?.tel_btq && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {error.tel_btq}
                        </p>
                    )}
                </div>

                {/* Mot de passe */}
                <div>
                    <label htmlFor="password_btq" className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="password"
                        id="password_btq"
                        name="password_btq"
                        value={formData.password_btq}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            error?.password_btq ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                    />
                    {error?.password_btq && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {error.password_btq}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-all ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {loading ? "Inscription en cours..." : "S'inscrire"}
                </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-600">
                Vous avez déjà un compte ?{" "}
                <Link
                    to="/connexionBoutique"
                    className="text-pink-500 hover:text-pink-700 font-medium"
                >
                    Connectez-vous
                </Link>
            </p>
        </ContainerForms>
    );
};

export default RegisterBoutique;
