// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: "taskmanager-a7592.firebaseapp.com",
    projectId: "taskmanager-a7592",
    storageBucket: "taskmanager-a7592.firebasestorage.app",
    messagingSenderId: "551853938756",
    appId: "1:551853938756:web:2027bdf1a861e183b88411",
    measurementId: "G-Z5S5HP4NEK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize analytics only if API key is available and not in development
let analytics = null;
if (import.meta.env.VITE_APP_FIREBASE_API_KEY && import.meta.env.PROD) {
    analytics = getAnalytics(app);
}

export { analytics };
