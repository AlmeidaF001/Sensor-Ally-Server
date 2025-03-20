// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcQYJn4s9yB-c9U4mkXFP0bSR-8GW8jHc",
  authDomain: "sensor-ally-d1d11.firebaseapp.com",
  projectId: "sensor-ally-d1d11",
  storageBucket: "sensor-ally-d1d11.firebasestorage.app",
  messagingSenderId: "489984849537",
  appId: "1:489984849537:web:1454d1c440ce880d5eff80"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});