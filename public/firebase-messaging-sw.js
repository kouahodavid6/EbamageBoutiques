/* eslint-disable no-undef */
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCb1ElYM7XTsIuonc9LOIDc0dDZVb0V8L4",
    authDomain: "ebamagenotificationsboutiques.firebaseapp.com",
    projectId: "ebamagenotificationsboutiques",
    storageBucket: "ebamagenotificationsboutiques.firebasestorage.app",
    messagingSenderId: "62911671539",
    appId: "1:62911671539:web:3afdc6516e6dde0763db86"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Gérer les notifications en background
messaging.onBackgroundMessage((payload) => {
    console.log('Notification reçue en background:', payload);
    
    const notificationTitle = payload.notification?.title || 'Nouvelle notification';
    const notificationOptions = {
        body: payload.notification?.body || 'Message important',
        icon: '/logo.png',
        badge: '/badge.png',
        data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer le clic sur les notifications
self.addEventListener('notificationclick', (event) => {
    console.log('Notification cliquée:', event.notification);
    event.notification.close();
    
    // Ouvrir l'application ou une URL spécifique
    event.waitUntil(
        clients.matchAll({type: 'window'}).then((windowClients) => {
            // Vérifier si une fenêtre est déjà ouverte
            for (let client of windowClients) {
                if (client.url.includes('/dashboard') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Sinon ouvrir une nouvelle fenêtre
            if (clients.openWindow) {
                return clients.openWindow('/dashboard');
            }
        })
    );
});