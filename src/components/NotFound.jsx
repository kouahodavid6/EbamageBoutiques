import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 text-gray-800 px-4">
            <div className="max-w-md text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <AlertTriangle className="h-12 w-12 text-red-600" />
                    </div>
                </div>

                <h1 className="text-5xl font-bold mb-4">404</h1>

                <h2 className="text-2xl font-semibold mb-2">Page non trouvée</h2>

                <p className="mb-6 text-gray-600">
                    Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>

                <Link
                    to="/"
                    className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
};

export default NotFound;