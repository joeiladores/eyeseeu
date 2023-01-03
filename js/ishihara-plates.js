import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'

import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot, addDoc, getDoc, doc,
  // deleteDoc,
  query, where, orderBy
  // serverTime
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'

// import {
//   getStorage, ref,
//   uploadBytesResumable, getDownloadURL
// } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js'

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
const db = getFirestore(app);

// Collection Reference
const platesRef = collection(db, 'ishihara-vcd-38');

// FETCH PLATES FROM FIRESTORE
const q = query(platesRef, orderBy("plate", "asc"));
onSnapshot(q, (snapshot) => {
  const plates = [];
  snapshot.docs.forEach((doc) => {
    plates.push({ ...doc.data(), id: doc.id });

    document.getElementById("plate-cards").innerHTML +=
    `
      <div class="col">
        <div class="card shadow-lg rounded-3">
          <div class="card-body border-bottom">
            <h5 class="card-title text-center">Plate ${doc.data().plate}</h5>
          </div>
          <img src=${doc.data().plateURL}" class="card-img-bottom" alt="Ishihara Plate ${doc.data().plate}">          
        </div>
      </div>    
    `


  });
});
