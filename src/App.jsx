import { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle } from "lucide-react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';

import Home from './pages/Home/Home'

import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register';

import Dashboard from './pages/Dashboard/Dashboard';
import Produits from './pages/Produits/Produits';
import Commandes from './pages/Commandes/Commandes';
import Variations from './pages/Variations/Variations';
import Profil from './pages/Profil/Profil';
import Notifications from './pages/notifications/Notifications';

import NotFound from './components/NotFound';

import { generateToken, messaging } from './notifications/firebase';
import { onMessage } from 'firebase/messaging';

function App() {
  useEffect(() => {
    generateToken();

    onMessage(messaging, (payload) => {
      console.log('Message en foreground:', payload);
    });
  }, []);

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes protégées - Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Dashboard-boutique - produits */}
            <Route
              path="/produits"
              element={
                <ProtectedRoute>
                  <Produits />
                </ProtectedRoute>
              }
            />
            {/* Dashboard-boutique - Commandes */}
            <Route
              path="commandes"
              element={
                <ProtectedRoute>
                  <Commandes />
                </ProtectedRoute>
              }
            />
            {/* Dashboard-boutique - Variations */}
            <Route 
              path='variations'
              element={
                <ProtectedRoute>
                  <Variations />
                </ProtectedRoute>
              }
            />
            {/* Dashboard-boutique - profil */}
            <Route 
              path='profil'
              element={
                <ProtectedRoute>
                  <Profil />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
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