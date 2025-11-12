// src/pages/variations/components/FormulaireLibelles.jsx
import { useEffect, useState } from "react";
import useVariationStore from "../../../stores/variationLibelle.store";
import { Plus, Trash2, RefreshCw, Palette, Check, X } from "lucide-react";
import toast from "react-hot-toast";

const FormulaireLibelles = () => {
  const { variations, fetchVariations, addLibelles, adding, loading } = useVariationStore();
  const [selectedVariation, setSelectedVariation] = useState("");
  const [variationsAvecLibelles, setVariationsAvecLibelles] = useState([]);
  const [fields, setFields] = useState([""]);

  // Charger les variations au montage du composant
  useEffect(() => {
    fetchVariations();
  }, [fetchVariations]);

  // Réinitialiser les champs quand la variation change
  useEffect(() => {
    if (selectedVariation) {
      setFields([""]);
    }
  }, [selectedVariation]);

  const handleFieldChange = (index, value) => {
    setFields((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addField = () => setFields((prev) => [...prev, ""]);

  const removeField = (index) => {
    if (fields.length > 1) {
      setFields((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleRefresh = () => {
    fetchVariations();
  };

  // Fonction pour déterminer si c'est une variation color
  const isColorVariation = (variationId = selectedVariation) => {
    if (!variationId) return false;
    const variationObj = variations.find(v => v.hashid === variationId);
    return variationObj?.nom_variation?.toLowerCase() === 'color';
  };

  // Fonction pour obtenir le nom de la variation
  const getVariationName = (variationId) => {
    if (!variationId) return "";
    const variationObj = variations.find(v => v.hashid === variationId);
    return variationObj?.nom_variation || "";
  };

  // Valider les libellés pour une variation
  const validerVariation = async () => {
    if (!selectedVariation) {
      toast.error("Choisissez une variation.");
      return;
    }

    const libelles = fields
      .map((f) => (f || "").trim())
      .filter((f) => f.length > 0)
      .filter((v, i, a) => a.indexOf(v) === i);

    if (libelles.length === 0) {
      toast.error("Ajoutez au moins un libellé valide.");
      return;
    }

    const variationName = getVariationName(selectedVariation);

    try {
      const result = await addLibelles(selectedVariation, libelles);
      
      if (result.success) {
        // Ajouter la variation validée à la liste
        setVariationsAvecLibelles(prev => [...prev, {
          hashid: selectedVariation,
          nom_variation: variationName,
          libelles: libelles,
          isColor: isColorVariation(selectedVariation)
        }]);

        toast.success(`Libellés validés pour "${variationName}"`);
        
        // Réinitialiser pour la prochaine variation
        setSelectedVariation("");
        setFields([""]);
      }
    } catch (err) {
      // L'erreur est déjà gérée dans le store
    }
  };

  // Supprimer une variation validée
  const supprimerVariationValidee = (hashid) => {
    setVariationsAvecLibelles(prev => prev.filter(v => v.hashid !== hashid));
    toast.success("Variation retirée");
  };

  // Soumettre le formulaire complet
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (variationsAvecLibelles.length === 0) {
      toast.error("Ajoutez au moins une variation avec ses libellés.");
      return;
    }

    toast.success("Toutes les variations ont été configurées avec succès !");
    
    // Réinitialiser le formulaire
    setVariationsAvecLibelles([]);
    setSelectedVariation("");
    setFields([""]);
  };

  const handleReset = () => {
    setFields([""]);
    setSelectedVariation("");
  };

  // Réinitialiser tout
  const handleResetComplet = () => {
    setVariationsAvecLibelles([]);
    setSelectedVariation("");
    setFields([""]);
  };

  // Composant pour afficher le champ approprié selon le type de variation
  const renderFieldInput = (value, index) => {
    if (isColorVariation()) {
      return (
        <div className="flex gap-3 items-center flex-1">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || '#3B82F6'}
              onChange={(e) => handleFieldChange(index, e.target.value)}
              className="w-12 h-12 rounded-lg border border-emerald-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300"
              title="Choisir une couleur"
            />
            <span className="text-sm text-emerald-600 font-medium min-w-[60px]">
              {value || 'Couleur'}
            </span>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(index, e.target.value)}
            placeholder="Nom de la couleur (ex: Rouge, Bleu, Vert)"
            className="flex-1 p-3 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
          />
        </div>
      );
    } else {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleFieldChange(index, e.target.value)}
          placeholder={`Option ${index + 1} (ex: XL, Rouge, Bleu)`}
          className="flex-1 p-3 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300"
        />
      );
    }
  };

  // Variations disponibles (exclure celles déjà validées)
  const variationsDisponibles = variations.filter(
    v => !variationsAvecLibelles.some(validated => validated.hashid === v.hashid)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête avec bouton rafraîchir */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-emerald-900">Configurer les variations</h3>
          <p className="text-sm text-emerald-600">Ajoutez et validez les libellés pour chaque variation</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </button>
      </div>

      {/* Section 1: Variations validées */}
      {variationsAvecLibelles.length > 0 && (
        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Variations configurées ({variationsAvecLibelles.length})
          </h4>
          
          <div className="space-y-2">
            {variationsAvecLibelles.map((variation) => (
              <div key={variation.hashid} className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  {variation.isColor && <Palette className="w-4 h-4 text-blue-500" />}
                  <div>
                    <span className="font-medium text-emerald-800">{variation.nom_variation}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {variation.libelles.map((libelle, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200"
                        >
                          {libelle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => supprimerVariationValidee(variation.hashid)}
                  className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  title="Retirer cette variation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Ajouter une nouvelle variation */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800">
          {variationsAvecLibelles.length > 0 ? "Ajouter une autre variation" : "Commencer par ajouter une variation"}
        </h4>

        {/* Sélection de la variation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-blue-800 mb-2">
              Sélectionner une variation
            </label>
            {loading ? (
              <div className="w-full p-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 text-center">
                <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                Chargement des variations...
              </div>
            ) : variationsDisponibles.length === 0 ? (
              <div className="w-full p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-center">
                {variations.length === 0 ? "Aucune variation disponible" : "Toutes les variations sont configurées"}
              </div>
            ) : (
              <select
                value={selectedVariation}
                onChange={(e) => setSelectedVariation(e.target.value)}
                className="w-full rounded-lg border border-blue-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              >
                <option value="">Choisir une variation...</option>
                {variationsDisponibles.map((v) => (
                  <option key={v.hashid} value={v.hashid}>
                    {v.nom_variation}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={addField}
              disabled={!selectedVariation}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              title={!selectedVariation ? "Sélectionnez d'abord une variation" : "Ajouter un champ de libellé"}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Ajouter option</span>
            </button>
          </div>
        </div>

        {/* Champs dynamiques pour les libellés */}
        {selectedVariation && (
          <div className="space-y-4 mt-4 p-4 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium text-blue-800">
                Options pour {getVariationName(selectedVariation)}:
              </label>
            </div>
            
            <div className="space-y-3">
              {fields.map((value, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  {renderFieldInput(value, idx)}
                  <button
                    type="button"
                    onClick={() => removeField(idx)}
                    disabled={fields.length === 1}
                    className="p-3 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 transition-colors"
                    aria-label="Supprimer champ"
                    title={fields.length === 1 ? "Au moins un champ est requis" : "Supprimer ce champ"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-blue-600">
              {fields.filter(f => f.trim()).length} option(s) valide(s) sur {fields.length} champ(s)
            </div>

            {/* Bouton de validation pour cette variation */}
            <div className="flex gap-3 pt-3 border-t border-blue-200">
              <button
                type="button"
                onClick={validerVariation}
                disabled={adding || fields.every(f => !f.trim())}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="w-4 h-4" />
                {adding ? "Validation..." : `Valider ${getVariationName(selectedVariation)}`}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={adding}
                className="px-4 py-3 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bouton de soumission final */}
      {variationsAvecLibelles.length > 0 && (
        <div className="flex gap-3 pt-4 border-t border-emerald-100">
          <button
            type="submit"
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium shadow-sm hover:from-emerald-700 hover:to-green-700 transition-all"
          >
            Terminer la configuration ({variationsAvecLibelles.length} variation(s))
          </button>

          <button
            type="button"
            onClick={handleResetComplet}
            className="px-4 py-3 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 transition-colors"
          >
            Tout recommencer
          </button>
        </div>
      )}

      {/* Messages d'information */}
      {!loading && variations.length === 0 && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
          <p className="font-medium">Aucune variation trouvée</p>
          <p className="text-sm mt-1">
            Créez d'abord des variations dans la section "Variations" avant de pouvoir ajouter des libellés.
          </p>
        </div>
      )}
    </form>
  );
};

export default FormulaireLibelles;