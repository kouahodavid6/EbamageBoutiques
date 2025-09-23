import { Link, useNavigate } from "react-router-dom";
import ContainerForms from "./components/ContainerForms";
import Input from "../../components/Input";
import { ArrowLeft, Store, AlertCircle, HandHeart, Sparkles } from "lucide-react";
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
            console.error("Erreur lors de l'inscription :", error);
        }
    };

    return (
        <ContainerForms>
            {/* Header avec effet spécial */}
            <div className="relative w-full flex items-center justify-between py-6 px-1">
                <Link
                    to="/"
                    className="rounded-full p-2 flex items-center justify-center transition-all duration-300 bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 hover:border-emerald-300 group"
                >
                    <ArrowLeft className="h-5 w-5 text-emerald-700 group-hover:text-emerald-800" />
                </Link>
                
                <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                        <Sparkles className="h-4 w-4 text-emerald-500 mr-2" />
                        <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                            Nouvelle Boutique
                        </h2>
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                        <HandHeart className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-medium">Rejoignez Ebamage</span>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-2 rounded-xl shadow-lg">
                    <Store className="h-6 w-6 text-white" />
                </div>
            </div>

            {/* Sous-titre inspirant */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-emerald-700/80 text-center leading-relaxed">
                    <strong>Digitalisez votre commerce</strong> avec une solution spécialement pensée pour vous
                </p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* Nom boutique */}
                <div>
                    <label htmlFor="nom_btq" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Nom de la boutique <span className="text-emerald-500">*</span>
                    </label>
                    <Input
                        type="text"
                        id="nom_btq"
                        name="nom_btq"
                        value={formData.nom_btq}
                        onChange={handleChange}
                        placeholder="Ma Super Boutique"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-3 focus:ring-emerald-200 transition-all duration-300 ${
                            error?.nom_btq 
                                ? "border-red-300 bg-red-50" 
                                : "border-emerald-200 focus:border-emerald-400"
                        }`}
                        required
                    />
                    {error?.nom_btq && (
                        <p className="mt-2 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {error.nom_btq}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email_btq" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Email professionnel <span className="text-emerald-500">*</span>
                    </label>
                    <Input
                        type="email"
                        id="email_btq"
                        name="email_btq"
                        value={formData.email_btq}
                        onChange={handleChange}
                        placeholder="contact@ma-boutique.com"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-3 focus:ring-emerald-200 transition-all duration-300 ${
                            error?.email_btq 
                                ? "border-red-300 bg-red-50" 
                                : "border-emerald-200 focus:border-emerald-400"
                        }`}
                        required
                    />
                    {error?.email_btq && (
                        <p className="mt-2 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {error.email_btq}
                        </p>
                    )}
                </div>

                {/* Téléphone */}
                <div>
                    <label htmlFor="tel_btq" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Téléphone <span className="text-emerald-500">*</span>
                    </label>
                    <Input
                        type="text"
                        id="tel_btq"
                        name="tel_btq"
                        value={formData.tel_btq}
                        onChange={handleChange}
                        placeholder="+225 01 01 01 01 01"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-3 focus:ring-emerald-200 transition-all duration-300 ${
                            error?.tel_btq 
                                ? "border-red-300 bg-red-50" 
                                : "border-emerald-200 focus:border-emerald-400"
                        }`}
                        required
                    />
                    {error?.tel_btq && (
                        <p className="mt-2 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {error.tel_btq}
                        </p>
                    )}
                </div>

                {/* Mot de passe */}
                <div>
                    <label htmlFor="password_btq" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Mot de passe sécurisé <span className="text-emerald-500">*</span>
                    </label>
                    <Input
                        type="password"
                        id="password_btq"
                        name="password_btq"
                        value={formData.password_btq}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-3 focus:ring-emerald-200 transition-all duration-300 ${
                            error?.password_btq 
                                ? "border-red-300 bg-red-50" 
                                : "border-emerald-200 focus:border-emerald-400"
                        }`}
                        required
                    />
                    {error?.password_btq && (
                        <p className="mt-2 text-sm text-red-600 flex items-center bg-red-50 px-3 py-2 rounded-lg">
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                            {error.password_btq}
                        </p>
                    )}
                    <p className="mt-1 text-xs text-emerald-600/70">
                        Utilisez au moins 8 caractères avec des chiffres et lettres
                    </p>
                </div>

                {/* Bouton de soumission */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-emerald-200/50 transform hover:-translate-y-0.5 ${
                        loading ? "opacity-50 cursor-not-allowed hover:transform-none" : ""
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Création en cours...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Créer ma boutique Ebamage
                        </div>
                    )}
                </button>
            </form>

            {/* Footer avec lien de connexion */}
            <div className="mt-8 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100">
                <p className="text-center text-sm text-emerald-700">
                    Vous avez déjà une boutique ?{" "}
                    <Link
                        to="/connexionBoutique"
                        className="font-semibold text-emerald-600 hover:text-emerald-800 underline transition-colors duration-300"
                    >
                        Connectez-vous ici
                    </Link>
                </p>
            </div>
        </ContainerForms>
    );
};

export default RegisterBoutique;