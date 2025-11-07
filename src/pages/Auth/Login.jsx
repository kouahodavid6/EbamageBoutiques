import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { ArrowLeft, Store, AlertCircle, HandHeart } from "lucide-react";
import { useState } from "react";
import useAuthStore from "../../stores/auth.store";
import ContainerForms from "./components/ContainerForms";

// Import Firebase (vous devrez installer firebase: npm install firebase)
import { getFCMToken } from "../../config/firebase";

const Login = () => {
    const [formData, setFormData] = useState({
        email_btq: "",
        password_btq: "",
    });

    const { loginBoutique, error, clearError, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        try {
            // Récupérer le token FCM pour le web
            console.log("🔄 Génération du token FCM...");
            const deviceToken = await getFCMToken();
            
            if (!deviceToken) {
                console.warn("⚠️ Token FCM non disponible - notifications désactivées");
                // Continuer sans notifications
            } else {
                console.log("✅ Token FCM obtenu:", deviceToken);
            }

            // Préparer les données avec le device_token
            const loginData = {
                ...formData,
                device_token: deviceToken || null
            };

            console.log("🔐 Tentative de connexion avec token FCM");

            const res = await loginBoutique(loginData);
            console.log("🎉 Connexion réussie", res);

            navigate("/dashboard");
        } catch (error) {
            console.error("❌ Erreur lors de la connexion :", error);
        }
    };

    return (
        <ContainerForms>
            {/* HEADER */}
            <div className="w-full flex items-center justify-between py-4 px-1">
                <Link
                    to="/"
                    className="rounded-full p-2 flex items-center justify-center transition-all duration-300 bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 hover:border-emerald-300 group"
                >
                    <ArrowLeft className="h-5 w-5 text-emerald-700 group-hover:text-emerald-800" />
                </Link>
                <div className="text-center">
                    <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
                        Connexion Boutique
                    </h2>
                    <div className="flex items-center justify-center mt-1 space-x-1">
                        <HandHeart className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs text-emerald-600 font-medium">Ebamage</span>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-2 rounded-xl shadow-lg">
                    <Store className="h-6 w-6 text-white" />
                </div>
            </div>

            {/* SOUS-TITRE */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-emerald-700/80 text-center leading-relaxed">
                    Reprenez le contrôle de votre boutique avec une gestion simplifiée
                </p>
                <div className="mt-2 flex items-center justify-center text-xs text-emerald-600">
                    <span className="bg-emerald-100 px-2 py-1 rounded-full">
                        🔔 Notifications activées
                    </span>
                </div>
            </div>

            {/* FORMULAIRE */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Email */}
                <div>
                    <label htmlFor="email_btq" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Email <span className="text-emerald-500">*</span>
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

                {/* Password */}
                <div>
                    <label htmlFor="password_btq" className="block text-sm font-semibold text-emerald-800 mb-2">
                        Mot de passe <span className="text-emerald-500">*</span>
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
                </div>

                {/* Lien mot de passe oublié */}
                <div className="text-right">
                    <Link
                        to="/mot-de-passe-oublie"
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-800 transition-colors duration-300 hover:underline"
                    >
                        Mot de passe oublié ?
                    </Link>
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
                            Connexion en cours...
                        </div>
                    ) : (
                        "Se connecter à ma boutique"
                    )}
                </button>
            </form>

            {/* LIEN VERS INSCRIPTION */}
            <div className="mt-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <p className="text-center text-sm text-emerald-700">
                    Vous n'avez pas encore de boutique ?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-emerald-600 hover:text-emerald-800 underline transition-colors duration-300"
                    >
                        Créer ma boutique Ebamage
                    </Link>
                </p>
            </div>
        </ContainerForms>
    );
};

export default Login;