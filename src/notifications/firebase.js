// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCb1ElYM7XTsIuonc9LOIDc0dDZVb0V8L4",
//   authDomain: "ebamagenotificationsboutiques.firebaseapp.com",
//   projectId: "ebamagenotificationsboutiques",
//   storageBucket: "ebamagenotificationsboutiques.firebasestorage.app",
//   messagingSenderId: "62911671539",
//   appId: "1:62911671539:web:3afdc6516e6dde0763db86",
//   measurementId: "G-GW705099DY"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// // Fonction pour récupérer le token FCM
// export const getFCMToken = async () => {
//   try {
//     console.log('Demande de permission pour les notifications...');
    
//     // Vérifier si les notifications sont supportées
//     if (!('Notification' in window)) {
//       console.warn('Ce navigateur ne supporte pas les notifications');
//       return null;
//     }

//     // Vérifier si les service workers sont supportés
//     if (!('serviceWorker' in navigator)) {
//       console.warn('Service Workers non supportés');
//       return null;
//     }

//     // Demander la permission
//     const permission = await Notification.requestPermission();
    
//     if (permission === 'granted') {
//       console.log('Permission accordée pour les notifications');
      
//       // Enregistrer le service worker
//       try {
//         const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
//         console.log('Service Worker enregistré:', registration);
//       } catch (swError) {
//         console.warn('Erreur Service Worker:', swError);
//       }

//       // Récupérer le token FCM
//       const token = await getToken(messaging, {
//         vapidKey: "BFbjH99UefaFQa84mffPAdgRrlmUEcpIEHq2YQS805NNtjwe_eYrtb5nDVoQ-vBCrzLyqB7H4iH7DwHXbQ2Zh0s" // À remplacer par votre VAPID key
//       });
      
//       if (token) {
//         console.log('Token FCM généré avec succès');
//         return token;
//       } else {
//         console.log('Aucun token disponible - vérifiez la configuration Firebase');
//         return null;
//       }
//     } else {
//       console.log('Permission refusée pour les notifications');
//       return null;
//     }
//   } catch (error) {
//     console.error('Erreur lors de la récupération du token FCM:', error);
//     return null;
//   }
// };

// // Écouter les messages en foreground
// export const onMessageListener = () => {
//   return new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       console.log('Message reçu en foreground:', payload);
//       resolve(payload);
//     });
//   });
// };

// export { messaging };


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

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
  const permission = await Notification.requestPermission();

  console.log(permission);

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BFbjH99UefaFQa84mffPAdgRrlmUEcpIEHq2YQS805NNtjwe_eYrtb5nDVoQ-vBCrzLyqB7H4iH7DwHXbQ2Zh0s"
    });
    console.log(token);
  }
}