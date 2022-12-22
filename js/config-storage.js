import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'

// Add Firebase products that you want to use
// import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'
import { getStorage, ref } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js'

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzkyd2zPrryUfoYjfdqF1PLim9ukvqZ7I",
  authDomain: "eyeseeu-22ad4.firebaseapp.com",
  projectId: "eyeseeu-22ad4",
  storageBucket: "eyeseeu-22ad4.appspot.com",
  messagingSenderId: "210845750796",
  appId: "1:210845750796:web:af3f92bccaf04fa201c029"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const storage = getStorage(app);

// Create a reference with an initial file path and name
const pathReference = ref(storage, 'services/stars.jpg');