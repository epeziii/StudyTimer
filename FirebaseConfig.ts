// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYQWsVCGROwIDENPwg7jAzCbF1HjYau20",
  authDomain: "studytimer-68e54.firebaseapp.com",
  projectId: "studytimer-68e54",
  storageBucket: "studytimer-68e54.firebasestorage.app",
  messagingSenderId: "540915655069",
  appId: "1:540915655069:web:aa397c925b66e5278b8f74"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);