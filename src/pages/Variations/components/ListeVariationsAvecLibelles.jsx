// src/pages/variations/components/ListeVariationsAvecLibelles.jsx
import { useEffect, useState } from "react";
import { Settings, Trash2, Edit3 } from "lucide-react";
import useVariationStore from "../../../stores/variationLibelle.store";
import DeleteConfirmModal from "../../components/DeleteConfirmModal"; // chemin selon ta structure

const ListeVariationsAvecLibelles = () => {
  const { variations, fetchVariations, deleteVariation, updateVariation, deleting } = useVariationStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [editing, setEditing] = useState(null); // hashid en édition
  const [editValues, setEditValues] = useState([]); // pour édition inline

  useEffect(() => {
    if (!variations || variations.length === 0) fetchVariations();
  }, []); // eslint-disable-line

  const openDelete = (variation) => {
    setToDelete(variation);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteVariation(toDelete.hashid);
    } catch (err) {
      console.error(err);
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
  const removeEditField = (i) => setEditValues((prev) => prev.filter((_, idx) => idx !== i));

  const submitEdit = async (hashid) => {
    // sanitize
    const libelles = editValues.map((v) => (v || "").trim()).filter((v) => v.length > 0);
    try {
      await updateVariation(hashid, libelles);
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      {variations.length === 0 && (
        <div className="text-center py-8 text-emerald-600">Aucune variation trouvée.</div>
      )}

      {variations.map((v) => (
        <div
          key={v.hashid}
          className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Settings className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">{v.nom_variation}</h3>
                <p className="text-sm text-emerald-600">{v.hashid}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(v)}
                className="px-3 py-2 rounded-lg border border-emerald-100 hover:bg-emerald-50"
                title="Modifier libellés"
              >
                <Edit3 className="w-4 h-4 text-emerald-700" />
              </button>
              <button
                onClick={() => openDelete(v)}
                className="px-3 py-2 rounded-lg border border-amber-100 bg-amber-50 hover:bg-amber-100"
                title="Supprimer variation"
              >
                <Trash2 className="w-4 h-4 text-amber-700" />
              </button>
            </div>
          </div>

          {/* contenu */}
          {editing === v.hashid ? (
            <div className="space-y-3">
              {editValues.map((val, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={val}
                    onChange={(e) => toggleEditValue(idx, e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-emerald-100"
                  />
                  <button
                    onClick={() => removeEditField(idx)}
                    className="p-2 rounded-lg bg-emerald-50"
                  >
                    <Trash2 className="w-4 h-4 text-amber-600" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <button onClick={addEditField} className="px-3 py-2 rounded-lg border">
                  Ajouter champ
                </button>
                <button
                  onClick={() => submitEdit(v.hashid)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-3 py-2 rounded-lg border"
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
                    <span key={i} className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">
                      {lbl}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-emerald-500">Aucun libellé</div>
              )}
            </div>
          )}
        </div>
      ))}

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
