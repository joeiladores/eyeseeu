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

const platesArray = [];

function showPlatesPreview() {

  platesArray.forEach((plate) => {

    // console.log(`Plate: ${plate.plate}`);
    // console.log(`Plate: ${plate.plateURL}`);

    document.getElementById("plate-cards-preview").innerHTML +=
      `
      <div class="col">
        <div class="card shadow-lg rounded-3 pb-3">
          <div class="card-body">
            <h5 class="card-title text-center">Plate ${plate.plate}</h5>
          </div>
          <div class="zoom-plate p-3">
            <img class="card-img-bottom img-fluid" src=${plate.plateURL}" alt="Ishihara Plate ${plate.plate}" data-plate=${plate.plate}>      
          </div>    
        </div>
      </div>    
    `
  });
}

function showCardModal(plateNum) {  
  // console.log(`Inside card modal...accepting plate no. ${plateNum}`);
  document.getElementById("cardModal").style.display = "block";
  document.getElementById("overlay").classList.add("active");
}

function closeCardModal() {
  document.getElementById("cardModal").style.display = "none";
  document.getElementById("overlay").classList.remove("active");
}

document.querySelector(".closeBtn").onclick = () => closeCardModal();

document.getElementById("plate-cards-preview").addEventListener("click", (e) => { 
  const card = e.target; 
  if (card.classList.contains("card-img-bottom")) {
    console.log(card.dataset.plate);
    showCardModal(card.dataset.plate);
  }
});


// FETCH PLATES FROM FIRESTORE AND DISPLAY IN CARDS
const q = query(platesRef, orderBy("plate", "asc"));
onSnapshot(q, (snapshot) => {

  snapshot.docs.forEach((doc) => {
    platesArray.push({ ...doc.data(), id: doc.id });
  });
  console.log(platesArray);
  showPlatesPreview();
});



