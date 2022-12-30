import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'

// Add Firebase products that you want to use
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'

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


// BOOKING SECTION *********************************************************************
// Collection Reference
const clinicRef = collection(db, 'clinic');

function populateClinicSelection() {
  // Get Collection Data
  getDocs(clinicRef)
    .then((snapshot) => {
      // console.log(snapshot.docs)
      const clinics = [];
      const clinicSelect = document.getElementById("selectClinic");

      snapshot.docs.forEach(clinic => {
        clinics.push({ ...clinic.data(), id: clinic.id })

        let clinicOption = document.createElement("option");
        clinicOption.setAttribute("value", `${clinic.data().id}`);
        clinicOption.textContent = `${clinic.data().name}`;
        clinicSelect.appendChild(clinicOption);
      });

    })
    .catch(err => {
      console.log(err.message);
    });
}

populateClinicSelection();
// END OF BOOKING SECTION *************************************************************








