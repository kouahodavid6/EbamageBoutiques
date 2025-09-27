import { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle } from "lucide-react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Homepages/Home'
import LoginBoutique from './pages/AuthPages/LoginBoutique';
import RegisterBoutique from './pages/AuthPages/RegisterBoutique';

import DashboardBoutique from './pages/DashboardBoutiquePages/DashboardBoutique';
import DashboardBoutiqueProduits from './pages/DashboardBoutiquePages/DashboardBoutiqueProduits';
import DashboardBoutiqueCommandes from './pages/DashboardBoutiquePages/DashboardBoutiqueCommandes';
import DashboardBoutiqueParametre from './pages/DashboardBoutiquePages/DashboardBoutiqueParametre';
import DashboardBoutiqueVariations from './pages/DashboardBoutiquePages/DashboardBoutiqueVariations';

import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Notifications toast */}
        <Toaster
          position="top-right"
          containerStyle={{
            zIndex: 99999,
            filter: "none",
            backdropFilter: "none"
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#f5f3ff",
              color: "#4c1d95",
              border: "1px solid #c4b5fd",
              padding: "12px 16px",
              fontWeight: "500",
              fontSize: "14px",
              backdropFilter: "none",
            },
            success: {
              icon: <CheckCircle className="text-[#166534] w-5 h-5" />,
              style: {
                background: "#bbf7d0",
                color: "#166534",
                borderColor: "#4ade80",
                backdropFilter: "none",
              },
            },
            error: {
              icon: <XCircle className="text-[#7f1d1d] w-5 h-5" />,
              style: {
                background: "#fee2e2",
                color: "#7f1d1d",
                borderColor: "#fca5a5",
                backdropFilter: "none",
              },
            },
          }}
        />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Authentification */}
            <Route path="/connexionBoutique" element={<LoginBoutique />} />
            <Route path="/inscriptionBoutique" element={<RegisterBoutique />} />

            {/* Routes protégées - Dashboard */}
            <Route
              path="/dashboard-boutique"
              element={
                <ProtectedRoute>
                  <DashboardBoutique />
                </ProtectedRoute>
              }
            />
            {/* Dashboard-boutique - produits */}
            <Route
              path="/dashboard-boutique/produits"
              element={
                <ProtectedRoute>
                  <DashboardBoutiqueProduits />
                </ProtectedRoute>
              }
            />
            {/* Dashboard-boutique - Commandes */}
            <Route
              path="/dashboard-boutique/commandes"
              element={
                <ProtectedRoute>
                  <DashboardBoutiqueCommandes />
                </ProtectedRoute>
              }
            />
            {/* Dashboard-boutique - Paramètre */}
            <Route 
              path='/dashboard-boutique/parametre'
              element={
                <ProtectedRoute>
                  <DashboardBoutiqueParametre />
                </ProtectedRoute>
              }
            />
            
            {/* Dashboard-boutique - Variations */}
            <Route 
              path='/dashboard-boutique/variations'
              element={
                <ProtectedRoute>
                  <DashboardBoutiqueVariations />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;