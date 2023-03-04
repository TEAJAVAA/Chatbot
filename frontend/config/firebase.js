import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence
  } from 'firebase/auth/react-native';
  
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import Constants from 'expo-constants';

// Firebase config
const firebaseConfig = {
    apiKey: Constants.manifest.extra.apiKey,
    authDomain: Constants.manifest.extra.authDomain,
    projectId: Constants.manifest.extra.projectId,
    storageBucket: Constants.manifest.extra.storageBucket,
    messagingSenderId: Constants.manifest.extra.messagingSenderId,
    appId: Constants.manifest.extra.appId,
    databaseURL: Constants.manifest.extra.databaseURL
};
// initialize firebase
// initializeApp(firebaseConfig);
// export const auth = getAuth();
// export const database = getFirestore();

let app;
let auth;

if (!getApps().length) {
    try {
        app = initializeApp(firebaseConfig);
        auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
    } catch (err) {
        console.log("error initializing");
    }
}
app = getApp();

const database = getFirestore();

export { auth, database };