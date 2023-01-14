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

document.getElementById("selectClinic").addEventListener("change", handleClinicChange);

function handleClinicChange() {

  const clinic = document.getElementById("selectClinic").value;
  const btnClinic = document.getElementById("displayBtnCalClinic");

  if (clinic === "1") {
    btnClinic.innerHTML =
      `
    <a href="" id="btnCalendly" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2"
    onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalcaloocan/consultation'});return false;"></i>&nbsp; Book an Appointment</a>
    `;
  }
  else if (clinic === "2") {

    btnClinic.innerHTML =
      `
    <a href="" id="btnCalendly" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2"
    onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticaliloilo/consultation'});return false;"><i
        class="bi bi-calendar2-event"></i>&nbsp; Book an Appointment</a>
    `;
  }
  else if (clinic === "3") {

    btnClinic.innerHTML =
      `
    <a href="" id="btnCalendly" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2"
    onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalgensan/consultation'});return false;"><i class="bi bi-calendar2-event"></i>&nbsp; Book an Appointment</a>
    `;
  }
  else {
    btnClinic.innerHTML =
      `
      <a id="btnCalendly" type="button" href="" width="150px" class="btn theme-color-light rounded-3 py-3 px-3 fw-2" data-bs-toggle="modal" data-bs-target="#errNoSelectedClinic"><i class="bi bi-calendar2-event"></i>&nbsp; Book an Appointment</a>
    `;
  }
  
};

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

// Grand Central
{/* <a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalcaloocan/consultation'});return false;">Book A Consultation</a>  */ }


// Iloilo
{/* <a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticaliloilo/consultation'});return false;">Book A Consultation</a> */ }


// Gensan
{/* <a href="" onclick="Calendly.initPopupWidget({url: 'https://calendly.com/esuopticalgensan/consultation'});return false;">Book A Consultation</a> */ }
