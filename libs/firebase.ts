// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaBlBbEf8fEn0ThwF-f22wve373ybXDqw",
    authDomain: "mt-shop-ce307.firebaseapp.com",
    projectId: "mt-shop-ce307",
    storageBucket: "mt-shop-ce307.appspot.com",
    messagingSenderId: "465296110464",
    appId: "1:465296110464:web:970dbee125374066964765"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;