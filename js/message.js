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

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const clinicRef = collection(db, "clinic");
let clinics = [];

// DISPLAY CLINIC BRANCH CONTACT INFO
getDocs(clinicRef)
  .then((snapshot) => {

    const clinicContact = document.getElementById("clinic-contacts");

    snapshot.docs.forEach((clinic) => {
      clinics.push({ ...clinic.data(), id: clinic.data().id });
    });

    clinics.sort(function (a, b) { return a.name - b.name });
    clinics.forEach((clinic) => {

      clinicContact.innerHTML +=
        `
          <div class="bg-light text-dark p-2 my-1 mb-2 rounded-2 opacity-75" >
            <div class="fs-5 fw-bold">${clinic.name}</div>
            <div><i class="fa-solid fa-phone"></i> ${clinic.phone}</div>
            <div><i class="fa-solid fa-envelope"></i> ${clinic.email}</div>
          </div>    
        `;

    });

  })
  .catch((err) => {
    console.log(err.message);
  });


// DISPLAY MODAL WITH SUCCESS OR ERROR MESSAGE
function displayModal(status, icon, message) {

  const modal = document.getElementById("customModal");

  modal.innerHTML =
    `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center shadow-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fs-5">${status}</h5>
            <button id="closeModalBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body d-flex flex-row align-items-center justify-content-center bg-light">
            <div class="fa-4x text-primary">${icon}</div>
            <div class="fs-5">${message}</div>
          </div>
        </div>
      </div>
    </div>
  `
  document.getElementById("customModal").style.display = "block";
  document.getElementById("overlay").classList.add("active");

  closeModalBtn.addEventListener("click", () => {
    document.getElementById("customModal").style.display = "none";
    document.getElementById("overlay").classList.remove("active");

  });

}

// SUBMIT FORM AND SEND EMAIL
document.getElementById("submitEmailBtn").onclick = (e) => {
  e.preventDefault();

  let serviceID, templateID, publicKey;
  let emailDetails = {
    from_name: document.getElementById("name").value,
    phone_number: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value
  };

  serviceID = "service_7wa8qy5";
  templateID = "template_xs15n5a";
  publicKey = "TsPUKvTE8hthKh6WF";

  emailjs.send(serviceID, templateID, emailDetails, publicKey)
    .then(
      (res) => {
        document.getElementById("name").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";
        document.getElementById("subject").value = "";
        document.getElementById("message").value = "";
        displayModal(`Success`, `<i class="fa-sharp fa-solid fa-circle-check"></i>`, ` Your message was sent successfully!`);
      }
    )
    .catch((err) => {
      displayModal(`Unsuccessful`, `<i class="fa-solid fa-circle-xmark"></i>`, ` Email not sent! Please fill in the message form completely`);
    });

}


