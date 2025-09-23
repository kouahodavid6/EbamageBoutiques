import { X, Edit, Trash2, PackageSearch, Image } from "lucide-react";
import { useEffect } from "react";

const ProduitDetailsModal = ({
  isOpen,
  onClose,
  produit,
  onEdit,
  onDelete,
}) => {
  useEffect(() => {
    if (isOpen && produit) {
      console.log("Produit reçu dans le modal :", produit);
    }
  }, [isOpen, produit]);

  if (!isOpen || !produit) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-[10000] bg-white max-w-2xl w-full rounded-xl shadow-lg border border-gray-100 p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100">
              <PackageSearch className="h-5 w-5 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Détails du produit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="space-y-4">
          {/* Images */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {produit.images?.length > 0 ? (
              produit.images.map((img, index) => (
                <div key={index} className="flex-shrink-0 w-32 h-32">
                  <img
                    src={img}
                    alt={`Image ${index + 1}`}
                    className="rounded-lg border w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center text-gray-400 w-full py-8">
                <Image className="w-6 h-6" />
                <span className="ml-2">Aucune image</span>
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-800">
              {produit.nom_article}
            </h3>
            {produit.description && (
              <div>
                <p className="font-semibold text-gray-800">Description :</p>
                <p className="text-gray-700">{produit.description}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-800">Prix :</p>
              <div className="flex items-center gap-2">
                <span className="text-pink-600 font-bold">
                  {produit.prix} FCFA
                </span>
                {produit.old_price && (
                  <span className="text-sm text-gray-500 line-through">
                    {produit.old_price} FCFA
                  </span>
                )}
              </div>
            </div>
            <div>
              {/* <p className="font-semibold text-gray-800">Stock :</p> */}
              <p className="text-pink-600 font-bold">{produit.stock}</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800">Catégories :</p>
            {produit.categories?.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {produit.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                    {cat.nom_categorie}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">Aucune catégorie</span>
            )}
          </div>

          {produit.variations?.length > 0 && (
            <div>
              <p className="font-semibold text-gray-800">Variations :</p>
              <div className="space-y-3 mt-2">
                {produit.variations.map((v, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">
                      {v.nom_variation}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {v.lib_variation.map((val, j) =>
                        v.nom_variation.includes("color") ? (
                          <span
                            key={j}
                            className="border text-gray-700 text-xs px-2 py-1 rounded w-8 h-8 "
                            style={{
                              backgroundColor: val,
                            }}
                          />
                        ) : (
                          <span
                            key={j}
                            className="bg-white border text-gray-700 text-xs px-2 py-1 rounded">
                            {val}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            <Edit className="w-4 h-4" />
            Modifier
          </button>

          <button
            onClick={onDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProduitDetailsModal;
