// src/pages/variations/components/ListeVariationsAvecLibelles.jsx
import { useEffect, useState } from "react";
import { Settings, Trash2, Edit3, RefreshCw, Palette } from "lucide-react";
import useVariationStore from "../../../stores/variationLibelle.store";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import toast from "react-hot-toast";

const ListeVariationsAvecLibelles = () => {
  const { 
    variationsBoutique, 
    fetchVariationsBoutique, 
    deleteVariation, 
    updateVariation, 
    deleting,
    loading 
  } = useVariationStore();
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editValues, setEditValues] = useState([]);

  // Charger les variations boutique au montage
  useEffect(() => {
    if (variationsBoutique.length === 0) {
      fetchVariationsBoutique();
    }
  }, [fetchVariationsBoutique, variationsBoutique.length]);

  const openDelete = (variation) => {
    setToDelete(variation);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteVariation(toDelete.hashid);
    } catch (err) {
      // L'erreur est déjà gérée dans le store
    } finally {
      setConfirmOpen(false);
      setToDelete(null);
    }
  };

  const startEdit = (variation) => {
    setEditing(variation.hashid);
    setEditValues(variation.lib_variation ? [...variation.lib_variation] : []);
  };

  const toggleEditValue = (index, value) => {
    setEditValues((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const addEditField = () => setEditValues((prev) => [...prev, ""]);
  
  const removeEditField = (i) => {
    if (editValues.length > 1) {
      setEditValues((prev) => prev.filter((_, idx) => idx !== i));
    }
  };

  const submitEdit = async (hashid) => {
    const libelles = editValues
      .map((v) => (v || "").trim())
      .filter((v) => v.length > 0);

    if (libelles.length === 0) {
      toast.error("Ajoutez au moins un libellé valide.");
      return;
    }

    try {
      await updateVariation(hashid, libelles);
      setEditing(null);
    } catch (err) {
      // L'erreur est déjà gérée dans le store
    }
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValues([]);
  };

  const handleRefresh = () => {
    fetchVariationsBoutique();
  };

  // Fonction pour déterminer si c'est une variation color
  const isColorVariation = (nomVariation) => {
    return nomVariation?.toLowerCase() === 'color';
  };

  // Fonction pour afficher les libellés avec style approprié
  const renderLibelle = (libelle, isColor) => {
    if (isColor) {
      return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm">
          <div 
            className="w-3 h-3 rounded border border-blue-200"
            style={{ backgroundColor: libelle }}
          />
          <span>{libelle}</span>
        </div>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">
          {libelle}
        </span>
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec bouton rafraîchir */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-emerald-900">Variations configurées</h3>
          <p className="text-sm text-emerald-600">
            {variationsBoutique.length} variation(s) avec libellés
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </button>
      </div>

      {loading && variationsBoutique.length === 0 ? (
        <div className="text-center py-8 text-emerald-600">
          <RefreshCw className="w-6 h-6 animate-spin inline mr-2" />
          Chargement des variations...
        </div>
      ) : variationsBoutique.length === 0 ? (
        <div className="text-center py-8 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">
          <Settings className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <p className="text-emerald-700 font-medium">Aucune variation configurée</p>
          <p className="text-emerald-600 text-sm mt-1">
            Ajoutez des libellés aux variations dans le formulaire ci-dessus.
          </p>
        </div>
      ) : (
        variationsBoutique.map((v) => (
          <div
            key={v.hashid}
            className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isColorVariation(v.nom_variation) 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {isColorVariation(v.nom_variation) ? (
                    <Palette className="w-5 h-5" />
                  ) : (
                    <Settings className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 capitalize">
                    {v.nom_variation}
                  </h3>
                  {isColorVariation(v.nom_variation) && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      Variation couleur
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(v)}
                  className="px-3 py-2 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
                  title="Modifier libellés"
                >
                  <Edit3 className="w-4 h-4 text-emerald-700" />
                </button>
                <button
                  onClick={() => openDelete(v)}
                  className="px-3 py-2 rounded-lg border border-amber-100 bg-amber-50 hover:bg-amber-100 transition-colors"
                  title="Supprimer variation"
                >
                  <Trash2 className="w-4 h-4 text-amber-700" />
                </button>
              </div>
            </div>

            {editing === v.hashid ? (
              <div className="space-y-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <label className="block text-sm font-medium text-emerald-800">
                  Modifier les libellés pour {v.nom_variation}:
                </label>
                
                {editValues.map((val, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {isColorVariation(v.nom_variation) ? (
                      <div className="flex gap-2 items-center flex-1">
                        <input
                          type="color"
                          value={val || '#3B82F6'}
                          onChange={(e) => toggleEditValue(idx, e.target.value)}
                          className="w-10 h-10 rounded border border-emerald-200 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => toggleEditValue(idx, e.target.value)}
                          placeholder="Nom de la couleur"
                          className="flex-1 p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => toggleEditValue(idx, e.target.value)}
                        placeholder={`Libellé ${idx + 1}`}
                        className="flex-1 p-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      />
                    )}
                    <button
                      onClick={() => removeEditField(idx)}
                      disabled={editValues.length === 1}
                      className="p-2 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 flex-wrap pt-2">
                  <button
                    onClick={addEditField}
                    className="px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    Ajouter un libellé
                  </button>
                  <button
                    onClick={() => submitEdit(v.hashid)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {v.lib_variation && v.lib_variation.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {v.lib_variation.map((lbl, i) => (
                      <div key={i}>
                        {renderLibelle(lbl, isColorVariation(v.nom_variation))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-emerald-500 italic">
                    Aucun libellé défini
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      <DeleteConfirmModal
        isOpen={confirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        entityName={toDelete?.nom_variation || "cette variation"}
        isDeleting={deleting}
      />
    </div>
  );
};

export default ListeVariationsAvecLibelles;