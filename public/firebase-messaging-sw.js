/* eslint-env serviceworker */
/* global importScripts, firebase */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyCb1ElYM7XTsIuonc9LOIDc0dDZVb0V8L4",
    authDomain: "ebamagenotificationsboutiques.firebaseapp.com",
    projectId: "ebamagenotificationsboutiques",
    storageBucket: "ebamagenotificationsboutiques.firebasestorage.app",
    messagingSenderId: "62911671539",
    appId: "1:62911671539:web:3afdc6516e6dde0763db86",
    measurementId: "G-GW705099DY"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});