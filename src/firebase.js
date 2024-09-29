// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD-o3-RoXE8QBOhxWAti5zNavhbC64D02E",
    authDomain: "chatgpt-app-bf682.firebaseapp.com",
    projectId: "chatgpt-app-bf682",
    storageBucket: "chatgpt-app-bf682.appspot.com",
    messagingSenderId: "108494971572",
    appId: "1:108494971572:web:5206df2579166a966dade1",
    measurementId: "G-YD2X1B58MG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
