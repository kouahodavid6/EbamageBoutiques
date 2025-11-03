// src/pages/variations/components/FormulaireLibelles.jsx
import { useEffect, useState } from "react";
import useVariationStore from "../../../stores/variationLibelle.store";
import { Plus, Trash2 } from "lucide-react";

const FormulaireLibelles = () => {
  const { variations, fetchVariations, addLibelles, adding, loading } = useVariationStore();
  const [selectedVariation, setSelectedVariation] = useState("");
  const [fields, setFields] = useState([""]); // champs dynamiques pour libellés

  useEffect(() => {
    // charger les variations s'il n'y en a pas
    if (!variations || variations.length === 0) fetchVariations();
  }, []); // eslint-disable-line

  const handleFieldChange = (index, value) => {
    setFields((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addField = () => setFields((prev) => [...prev, ""]);

  const removeField = (index) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVariation) return alert("Choisissez une variation.");
    // nettoyer libellés : trim, enlever vides, uniques
    const libelles = fields
      .map((f) => (f || "").trim())
      .filter((f) => f.length > 0)
      .filter((v, i, a) => a.indexOf(v) === i);

    if (libelles.length === 0) return alert("Ajoutez au moins un libellé valide.");

    try {
      await addLibelles(selectedVariation, libelles);
      // reset formulaire : garder select, reset fields
      setFields([""]);
    } catch (err) {
      // error handled in store via toast
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-green-800 mb-2">Variation</label>
          <select
            value={selectedVariation}
            onChange={(e) => setSelectedVariation(e.target.value)}
            className="w-full rounded-lg border border-green-100 p-3"
          >
            <option value="">-- Choisir une variation --</option>
            {variations.map((v) => (
              <option key={v.hashid} value={v.hashid}>
                {v.nom_variation}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              // si aucune variation sélectionnée, forcer le chargement
              if (!selectedVariation && variations.length > 0) setSelectedVariation(variations[0].hashid);
              addField();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            title="Ajouter un champ de libellé"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Ajouter champ</span>
          </button>
        </div>
      </div>

      {/* Champs dynamiques */}
      <div className="space-y-3 mb-4">
        {fields.map((value, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(idx, e.target.value)}
              placeholder={`Libellé ${idx + 1} (ex: XL, Rouge)`}
              className="flex-1 p-3 rounded-lg border border-green-100"
            />
            <button
              type="button"
              onClick={() => removeField(idx)}
              className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 hover:bg-emerald-100"
              aria-label="Supprimer champ"
            >
              <Trash2 className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={adding}
          className="px-5 py-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium shadow-sm disabled:opacity-60"
        >
          {adding ? "Ajout en cours..." : "Enregistrer les libellés"}
        </button>

        <button
          type="button"
          onClick={() => {
            setFields([""]);
          }}
          className="px-4 py-3 rounded-lg border border-emerald-200 text-emerald-700"
        >
          Réinitialiser
        </button>
      </div>

      {loading && (
        <p className="mt-3 text-sm text-emerald-600">Chargement des variations...</p>
      )}
    </form>
  );
};

export default FormulaireLibelles;
