import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

// Add Firebase products that you want to use
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDzkyd2zPrryUfoYjfdqF1PLim9ukvqZ7I",
  authDomain: "eyeseeu-22ad4.firebaseapp.com",
  projectId: "eyeseeu-22ad4",
  storageBucket: "eyeseeu-22ad4.appspot.com",
  messagingSenderId: "210845750796",
  appId: "1:210845750796:web:af3f92bccaf04fa201c029",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);

// MESSAGE SECTION *********************************************************************
// Collection Reference
const clinicRef = collection(db, "clinic");
let clinics = [];

function m__populateClinicInfo() {

  // Get Collection Data
  getDocs(clinicRef)
    .then((snapshot) => {
      // console.log(snapshot.docs)
      
      const clinicSelect = document.getElementById("m__selectClinic");
      const clinicContact = document.getElementById("clinic-contacts");

      snapshot.docs.forEach((clinic) => {
        clinics.push({ ...clinic.data(), id: clinic.data().id });
      });
      console.log(clinics);

      clinics.sort(function(a, b){return a.name - b.name}); 
      clinics.forEach((clinic) => {

        let clinicOption = document.createElement("option");
        clinicOption.setAttribute("value", `${clinic.name}`);
        clinicOption.textContent = `${clinic.name}`;
        clinicSelect.appendChild(clinicOption);

        clinicContact.innerHTML +=
          `
          <div class="bg-light text-dark p-2 my-1 mb-3 rounded-2 opacity-75" >
            <div><h5>${clinic.name}</h5></div>
            <div><i class="fa-solid fa-phone"></i> ${clinic.phone}</div>
            <div><i class="fa-solid fa-envelope"></i> ${clinic.email}</div>
          </div>    
        `;

      });

    })
    .catch((err) => {
      console.log(err.message);
    });
}

function displayModal(status, icon, message) {

  console.log(`status: ${status}`);
  console.log(`message: ${message}`);

  const modal = document.getElementById("customModal");

  modal.innerHTML =
    `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center shadow-lg bg-transparent">
        <div class="modal-header bg-primary">
          <h1 class="modal-title fs-5">${status}</h1>
          <button id="closeModalBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body px-5 bg-light">
          <div class="mb-3 animated rotateIn me-3 d-flex flex-row align-items-center justify-content-center">
            <div class="fa-4x mb-3 animated rotateIn me-3 align-self-center text-primary">${icon}</div>
            <div class="fs-5">${message}</div>
          </div>
        </div>
      </div>
    </div>
  `

  document.getElementById("customModal").style.display = "block";

  closeModalBtn.addEventListener("click", () => {
    document.getElementById("customModal").style.display = "none";
  });

}

document.getElementById("m__selectClinic").onchange = () => {

}

document.getElementById("submitBtn").onclick = (e) => {
  e.preventDefault();

  if (document.getElementById("m__selectClinic").value != 0) {

    let serviceID, templateID, publicKey;
    let emailDetails = {
      from_name: document.getElementById("name").value,
      phone_number: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value
    };

    clinics.forEach((clinic) => {
      if (document.getElementById("m__selectClinic").value === clinic.name) {
        serviceID = clinic.emailjs_serviceID;
        templateID = clinic.emailjs_templateID;
        publicKey = clinic.emailjs_publicKey;
      }
    });

    emailjs.send(serviceID, templateID, emailDetails, publicKey)
      .then(
        (res) => {
          document.getElementById("m__selectClinic").value = 0;
          document.getElementById("name").value = "";
          document.getElementById("phone").value = "";
          document.getElementById("email").value = "";
          document.getElementById("subject").value = "";
          document.getElementById("message").value = "";
          displayModal(`Success`, `<i class="fa-sharp fa-solid fa-circle-check"></i>`, `Your message was sent successfully!`);
        }
      )
      .catch((err) => console.log(err));
  }
  else {
    displayModal(`Warning`, `<i class="fa-solid fa-circle-xmark"></i>`, `Email not sent! Please fill in the input form`);
  }

}

m__populateClinicInfo();


