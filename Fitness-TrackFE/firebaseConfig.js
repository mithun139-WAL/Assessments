import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAQuT3-paAJrV0isTwV7AWZQ4uj9g6jmA4",
  authDomain: "fitnesstrack-b139821.firebaseapp.com",
  projectId: "fitnesstrack-b139821",
  storageBucket: "fitnesstrack-b139821.appspot.com",
  messagingSenderId: "110581947519",
  appId: "1:110581947519:web:8165ed8291ae3513b4b34a",
  measurementId: "G-G1Q1L9XH4P",
  webClientId: "295526462555-khfkq4ds64hkiofgn8hanocmos7g8ask.apps.googleusercontent.com",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export {auth};
