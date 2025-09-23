import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/auth.store';

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas connecté
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!user) {
    return <Navigate to="/connexionBoutique" replace />;
  }

  // Si l'utilisateur est connecté, afficher le contenu de la route
  return children;
};

export default ProtectedRoute;