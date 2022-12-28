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

import {
  getStorage, ref,
  uploadBytesResumable, getDownloadURL
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js'

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
const ishiharaRef = collection(db, 'ishihara-page');

// GET REAL TIME COLLECTION DATA
onSnapshot(ishiharaRef, (snapshot) => {
  // let page = [];
  snapshot.docs.forEach((doc) => {
    // page.push({ ...doc.data(), id: doc.id })
    if (doc.data().type === "introduction") {
      populateIntroduction(doc.data());
    }
    if (doc.data().type === "instruction") {
      populateInstruction(doc.data());
    }
  });
});

function populateIntroduction(intro) {
  console.log(intro);
  document.querySelector(".introduction").innerHTML =
    `
  <img class="ishihara-bg" src="${intro.intro_bg_image}" alt="" />
    <h2 class="pb-3">${intro.intro_title}</h2>
    <div>
      <img class="img-fluid px-5 pb-3" src="${intro.intro_header_img}" alt="" />
    </div>
    <div class="content px-5">${intro.intro_content}</div>
  </div>
    
  `;

}

function populateInstruction(inst) {
  console.log(inst);
  document.querySelector(".instruction").innerHTML =
    `
    <h2 class="text-center">${inst.instruction_title}</h2>
    ${inst.instruction}
    ${inst.notes}    
  `;
}
