// src/hooks/useFirebaseMessaging.js
import { useEffect } from 'react';
import { messaging } from '../firebase';
import { getToken, onMessage } from 'firebase/messaging';

const VAPID_KEY = 'YOUR_PUBLIC_VAPID_KEY'; // From Firebase console

const useFirebaseMessaging = () => {
  useEffect(() => {
    // Request permission
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, { vapidKey: VAPID_KEY })
          .then((currentToken) => {
            if (currentToken) {
              console.log('FCM Token:', currentToken);
              // Send token to backend here if needed
            } else {
              console.warn('No registration token available. Request permission to generate one.');
            }
          })
          .catch((err) => {
            console.error('An error occurred while retrieving token. ', err);
          });
      }
    });

    // Listen for messages when app is in foreground
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Optionally show notification or handle data
    });
  }, []);
};

export default useFirebaseMessaging;
