import { useEffect } from 'react';
import useCategorieStore from '../stores/categorie.store';

const CategoriesList = () => {
  const { categories, loading, error, fetchCategories } = useCategorieStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) return <div className="p-4">Chargement des catégories...</div>;
  if (error) return <div className="p-4 text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Liste des catégories</h2>
      {categories.length === 0 ? (
        <p>Aucune catégorie disponible</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((categorie) => (
            <div key={categorie.hashid} className="border rounded-lg p-4 shadow-sm">
              <div className="flex items-center space-x-4">
                {categorie.image_categorie && (
                  <img 
                    src={categorie.image_categorie.replace(/[\s`]/g, '')} 
                    alt={categorie.nom_categorie} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{categorie.nom_categorie}</h3>
                  <p className="text-xs text-gray-500">ID: {categorie.hashid}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesList;