// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCb1ElYM7XTsIuonc9LOIDc0dDZVb0V8L4",
  authDomain: "ebamagenotificationsboutiques.firebaseapp.com",
  projectId: "ebamagenotificationsboutiques",
  storageBucket: "ebamagenotificationsboutiques.firebasestorage.app",
  messagingSenderId: "62911671539",
  appId: "1:62911671539:web:3afdc6516e6dde0763db86",
  measurementId: "G-GW705099DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log("Permission:", permission);

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BFbjH99UefaFQa84mffPAdgRrlmUEcpIEHq2YQS805NNtjwe_eYrtb5nDVoQ-vBCrzLyqB7H4iH7DwHXbQ2Zh0s"
      });
      console.log("✅ Token Firebase généré:", token);
      return token; // 🔥 CORRECTION : Retourner le token
    } else {
      console.log("❌ Permission refusée pour les notifications");
      return null;
    }
  } catch (error) {
    console.error("❌ Erreur lors de la génération du token:", error);
    return null;
  }
}

// Pour les messages en foreground
export { onMessage };