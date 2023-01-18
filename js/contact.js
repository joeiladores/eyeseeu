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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const clinicRef = collection(db, 'clinic');
const clinics = [];

getDocs(clinicRef)
  .then((snapshot) => {

    const clinicSelect = document.getElementById("selectClinic");

    snapshot.docs.forEach(clinic => {
      clinics.push({ ...clinic.data()})

      let clinicOption = document.createElement("option");
      clinicOption.setAttribute("value", `${clinic.data().id}`);
      clinicOption.textContent = `${clinic.data().name}`;
      clinicSelect.appendChild(clinicOption);
    });

  })
  .catch(err => {
    console.log(err.message);
  });

document.getElementById("selectClinic").addEventListener("change", handleClinicChange);

function handleClinicChange() {

  const s_clinic = parseInt(document.getElementById("selectClinic").value);
  const btnClinic = document.getElementById("displayBtnCalClinic");

  if(typeof s_clinic == "number" && s_clinic > 0) {
    clinics.forEach((clinic) => {

      console.log(typeof s_clinic);
      console.log(s_clinic);
      console.log(clinic.id);
      console.log(clinic.name);
      console.log(clinic.calendly_url);
  
      if(parseInt(clinic.id) === s_clinic) {
        btnClinic.innerHTML =
        `
        <a href="" id="btnCalendly" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2"
        onclick="Calendly.initPopupWidget({url: '${clinic.calendly_url}'});return false;"></i>&nbsp; Book an Appointment</a>
        `   
      }   
      console.log(btnClinic.innerHTML);
    }); 
  }
  else {
    btnClinic.innerHTML =
      `
      <a id="btnCalendly" type="button" href="" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2" data-bs-toggle="modal" data-bs-target="#errNoSelectedClinic"><i class="bi bi-calendar2-event"></i>&nbsp; Book an Appointment</a>
    `;
  }
  
};