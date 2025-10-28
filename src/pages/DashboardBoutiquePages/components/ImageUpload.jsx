import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, X, AlertCircle } from "lucide-react";
import useBoutiqueInfoStore from "../../../stores/infoBoutique.store";

const ImageUpload = ({ boutique, loading }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const fileInputRef = useRef(null);
    const { updateBoutiqueImage } = useBoutiqueInfoStore();

    const handleImageClick = () => {
        setUploadError(null);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadError(null);

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            setUploadError('Veuillez sélectionner une image valide (JPG, PNG, etc.)');
            return;
        }

        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('L\'image ne doit pas dépasser 5MB');
            return;
        }

        // Créer une preview
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);

        // Uploader l'image
        setIsUploading(true);
        try {
            await updateBoutiqueImage(boutique.hashid, file);
            setPreviewUrl(null);
            setUploadError(null);
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            setUploadError(error.message || "Erreur lors de l'upload de l'image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removePreview = () => {
        setPreviewUrl(null);
        setUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Vérifier si l'image est manquante
    const isImageMissing = !boutique?.image_btq && !previewUrl;

    // Skeleton pendant le chargement
    if (loading) {
        return (
            <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-green-100">
                <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-green-100 animate-pulse"></div>
                </div>
                <div className="flex-1">
                    <div className="h-6 bg-green-100 rounded w-1/3 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-green-100 rounded w-2/3 mb-3 animate-pulse"></div>
                    <div className="h-10 bg-green-100 rounded w-32 animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-6 mb-6 pb-6 border-b border-green-100">
            {/* Avatar/Image */}
            <div className="relative">
                <motion.div
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 ${
                        isImageMissing ? 'border-red-300 bg-red-50' : 'border-green-200'
                    } group cursor-pointer ${
                        isUploading ? 'opacity-50' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={!isUploading ? handleImageClick : undefined}
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Preview de la nouvelle image"
                            className="w-full h-full object-cover"
                        />
                    ) : boutique?.image_btq ? (
                        <img
                            src={boutique.image_btq}
                            alt={`Photo de ${boutique?.nom_btq}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center ${
                            isImageMissing 
                                ? 'bg-gradient-to-br from-red-400 to-orange-500' 
                                : 'bg-gradient-to-br from-green-500 to-emerald-600'
                        }`}>
                            <span className="text-white font-bold text-xl">
                                {boutique?.nom_btq 
                                    ? boutique.nom_btq.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
                                    : 'BT'
                                }
                            </span>
                        </div>
                    )}

                    {/* Overlay au survol */}
                    {!isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    )}

                    {/* Indicateur de chargement */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </motion.div>

                {/* Badge de prévisualisation */}
                {previewUrl && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1"
                    >
                        <span>Preview</span>
                        <button
                            onClick={removePreview}
                            className="hover:bg-orange-600 rounded-full p-0.5"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </motion.div>
                )}

                {/* Badge d'alerte si image manquante */}
                {isImageMissing && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1"
                    >
                        <AlertCircle className="w-3 h-3" />
                        <span>Requis</span>
                    </motion.div>
                )}
            </div>

            {/* Texte explicatif */}
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-green-900">
                        Photo de la boutique
                    </h3>
                    {isImageMissing && (
                        <span className="text-red-500 text-sm font-medium bg-red-50 px-2 py-1 rounded-full">
                            Obligatoire
                        </span>
                    )}
                </div>
                
                <p className="text-green-600 text-sm mb-3">
                    {isImageMissing ? (
                        <span className="text-red-600">
                            ⚠️ Vous devez ajouter une photo pour votre boutique. 
                            Cliquez sur l'avatar pour télécharger une image.
                        </span>
                    ) : (
                        "Cliquez sur l'avatar pour changer la photo de votre boutique. Formats supportés: JPG, PNG (max. 5MB)"
                    )}
                </p>

                {/* Affichage des erreurs d'upload */}
                {uploadError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl"
                    >
                        <p className="text-red-700 text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {uploadError}
                        </p>
                    </motion.div>
                )}
                
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <div className="flex items-center space-x-4">
                    <motion.button
                        type="button"
                        onClick={handleImageClick}
                        disabled={isUploading}
                        className={`flex items-center space-x-2 ${
                            isImageMissing 
                                ? 'text-red-700 hover:text-red-800 bg-red-50 px-4 py-2 rounded-xl' 
                                : 'text-green-700 hover:text-green-800'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Upload className="w-4 h-4" />
                        <span>
                            {isUploading ? 'Upload en cours...' : 
                             isImageMissing ? 'Ajouter une photo' : 'Changer la photo'}
                        </span>
                    </motion.button>

                    {isImageMissing && !uploadError && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center space-x-1 text-red-600 text-sm"
                        >
                            <AlertCircle className="w-4 h-4" />
                            <span>Cette image est requise</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;