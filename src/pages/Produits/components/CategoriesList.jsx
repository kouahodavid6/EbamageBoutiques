import { useEffect } from 'react';
import useCategorieStore from '../../../stores/categorie.store';
import { motion } from 'framer-motion';
import { Folder, Image as ImageIcon } from 'lucide-react';

const CategoriesList = () => {
  const { categories, loading, error, fetchCategories } = useCategorieStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Variants d'animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  // Skeleton loader for categories
  const CategorySkeleton = () => (
    <div className="border border-emerald-100 rounded-xl p-4 bg-white/50 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-emerald-200 rounded-lg flex-shrink-0"></div>
        
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-emerald-200 rounded w-3/4"></div>
          <div className="h-3 bg-emerald-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* <div className="mt-3 pt-2 border-t border-emerald-100">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-emerald-200 rounded w-20"></div>
          <div className="w-2 h-2 bg-emerald-200 rounded-full"></div>
        </div>
      </div> */}
    </div>
  );

  if (loading) return (
    <motion.div 
      className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-xl">
          <Folder className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-900">Chargement des catégories</h2>
          <p className="text-emerald-600/70 text-sm">Préparation de votre liste...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(categories.length)].map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    </motion.div>
  );

  if (error) return (
    <motion.div 
      className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <p className="font-medium">Erreur lors du chargement des catégories</p>
      <p className="text-sm mt-1">{error}</p>
    </motion.div>
  );

  return (
    <motion.div 
      className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-xl">
          <Folder className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-900">Catégories disponibles</h2>
          <p className="text-emerald-600/70 text-sm">
            {categories.length} catégorie{categories.length !== 1 ? 's' : ''} dans votre boutique
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Folder className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-emerald-900 mb-2">Aucune catégorie disponible</h3>
          <p className="text-emerald-600/70">
            Commencez par créer vos premières catégories pour organiser vos produits
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((categorie) => (
            <motion.div 
              key={categorie.hashid} 
              className="border border-emerald-100 rounded-xl p-4 bg-white/50 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
              variants={itemVariants}
              whileHover="hover"
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {categorie.image_categorie ? (
                    <img 
                      src={categorie.image_categorie.replace(/[\s`]/g, '')} 
                      alt={categorie.nom_categorie} 
                      className="w-12 h-12 object-cover rounded-lg border border-emerald-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg border border-emerald-200 flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-emerald-400" />
                    </div>
                  )}
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-emerald-900 text-sm truncate">
                    {categorie.nom_categorie}
                  </h3>
                </div>
              </div>

              {/* Badge indicateur
              <motion.div 
                className="mt-3 pt-2 border-t border-emerald-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-emerald-500/60">
                    {categorie.image_categorie ? 'Avec image' : 'Sans image'}
                  </span>
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${
                      categorie.image_categorie ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    whileHover={{ scale: 1.5 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div> */}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Statistiques */}
      {categories.length > 0 && (
        <motion.div 
          className="mt-6 pt-4 border-t border-emerald-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-wrap gap-4 text-sm text-emerald-600/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Total: {categories.length} catégorie{categories.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>
                {categories.filter(cat => cat.image_categorie).length} avec image
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span>
                {categories.filter(cat => !cat.image_categorie).length} sans image
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoriesList;