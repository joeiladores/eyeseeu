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
const pageRef = collection(db, 'ishihara-page');
const platesRef = collection(db, 'ishihara-vcd-38');

const answer = [];
const plates = [];
let counter = 0;

function displayPlates(plate) {

  let progressValue = Math.floor((plate.plate / 38) * 100);

  // COMPUTE AND DISPLAY PROGRESS BAR
  document.querySelector(".progress").innerHTML =
    `
    <div class="progress-bar" role="progressbar" aria-label="Progress bar" style="width: ${progressValue}%" aria-valuenow="${progressValue}"
    aria-valuemin="0" aria-valuemax="100"></div>
  `

  // FETCH AND DISPLAY PLATE NUMBER ND IMAGE
  document.querySelector(".plate-container").innerHTML =
    `
    <div class="plate-name pt-2 text-center">
      <h5>Plate ${plate.plate}</h5>
    </div>
    <img id="plate-Q" class="plate-Q ishihara-plate-img img-fluid" src="${plate.plateURL}"
      alt="Ishihara Plate ${plate.plate}" data-plate="${plate.plate}" data-url="plateURL"/>
    <img id="plate-A" class="plate-A ishihara-plate-img img-fluid" src="${plate.plateURL2}" style="display: none"
      alt="Ishihara Plate ${plate.plate}" data-plate="${plate.plate}" data-url="plateURL2"/>
  `

  // FETCH AND DISPLAY OPTIONS
  // console.log(plate.options);
  let optionsElement = "", option = "";
  for (let i = 0; i < plate.options.length; i++) {
    option = plate.options[i];

    if (option === "I don’t know") {
      optionsElement += `<div class="optionBtn btn btn-primary" data-option="nothing" data-selected=false>${option}</div>`;
    }
    else {
      optionsElement += `<div class="optionBtn btn btn-primary" data-option=${option} data-selected=false>${option}</div>`;
    }
  }
  // console.log(optionsElement);
  document.querySelector(".options").innerHTML =
    `
    ${optionsElement}
    <button id="nextBtn" class="btn btn-dark" data-option="next">Next</button>
  `;

  // FETCH AND DISPLAY PLATE INFORMATION
  let info = "";
  for (let i = 0; i < plate.display.length; i++) {
    info += `<p>${plate.display[i]}</p>`;
  }
  document.querySelector(".plate-info").innerHTML =
    `
      <h5>What did you see?</h5>
      <hr>
      ${info}
  `
}

function hidePlateQ() {
  document.querySelector(".plate-Q").style.display = "none";
}

function showPlateA() {
  document.querySelector(".plate-A").style.display = "block";
  document.querySelector(".plate-info").style.display = "block";
}

function showPlateQ() {
  document.querySelector(".plate-Q").style.display = "block";
}

function hidePlateA() {
  document.querySelector(".plate-A").style.display = "none";
  document.querySelector(".plate-info").style.display = "none";
}

function showModal() {
  document.getElementById("errModal").style.display = "block";
  document.getElementById("overlay").classList.add("active");
}

// TODO: DESELECT ACTIVE AND SELECTED TO FALSE
function deselectOtherOptions() {

}


// SDD EVENT LISTNER TO THE MODAL CLOSE BUTTON
document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("errModal").style.display = "none";
  document.getElementById("overlay").classList.remove("active");
});


// ADD EVENT LISTERNER TO THE PLATE IMAGE
document.querySelector(".plate-container").addEventListener("click", (e) => {

  let targetElement = e.target;
  // let elementID = targetElement.id;

  if (targetElement.classList.contains("plate-Q")) {
    hidePlateQ();
    showPlateA();
  }
  if (targetElement.classList.contains("plate-A")) {
    hidePlateA();
    showPlateQ();
  }
});

function activateElement(element) {
  element.classList.add("active");
  element.classList.remove("inactive");
}

function deactivateElement(element) {
  element.classList.add("inactive");
  element.classList.remove("active");
}

// ADD EVETN LISTENER TO THE START BUTTON, OPEN THE PILL TEST
document.getElementById("startBtn").addEventListener("click", () => {
  activateElement(document.getElementById("nav-pill-test"));
  deactivateElement(document.getElementById("nav-pill-inst"));
  activateElement(document.getElementById("tab-3"));
  deactivateElement(document.getElementById("tab-2"));
  startTest();
});

function startTest() {

  let selectedOption = "";

  // FETCH PLATES FROM FIRESTORE
  const q = query(platesRef, orderBy("plate", "asc"));
  onSnapshot(q, (snapshot) => {

    snapshot.docs.forEach((doc) => {
      plates.push({ ...doc.data(), id: doc.id });
    });

    // DISPLAY INITIAL PLATE 1
    displayPlates(plates[0]);

    // ADD EVENT LISTENERS TO OPTIONS
    document.querySelector(".options").addEventListener("click", (e) => {
      e.preventDefault();

      let targetElement = e.target;
      let option = targetElement.dataset.option;

      if (option === "next" && selectedOption != "") {

        counter++;
        // PUSH SELECTED OPTION TO THE ANSWER ARRAY
        answer.push(selectedOption);
        console.log(answer);
        hidePlateA();

        // RESET SELECTED OPTION TO ""
        selectedOption = "";
      }
      else if (option === "next" && selectedOption === "") {
        showModal();
      }
      else {
        // ONLY CLICK ON BUTTON OPTIONS AND NOT OTHER CHILD ELEMENTS
        if (targetElement.classList.contains("optionBtn")) {
          selectedOption = option;
          targetElement.classList.add("active");
          targetElement.dataset.selected = "true";
          targetElement.classList.remove("btn-primary");
          targetElement.classList.add("btn-warning");

          // TODO: INACTIVATE AND DESELECT OTHER OPTIONS
          deselectOtherOptions();

          // console.log(targetElement);
          // TODO: FIX BUTTON COLOR ACTIVE
        }
      }

      // DISPLAY NEZXT PLATE EVERY CLICK ON NEXT BUTTON
      displayPlates(plates[counter]);

      if (counter === 37) {
        console.log("End of plates");
        console.log(`Final Answer[]: ${answer}`);

        
        // TODO: COMPUTE RESULTS AND DISOPLAY AS RESPONSIVE TABLE

      }

    });

  });

}

// FOR THE PLATES PAGE
function showPlatesPreview() {

  // console.log("Plates preview...");
  // console.log(plates);

  plates.forEach((plate) => {

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
  console.log(`Inside card modal...accepting plate no. ${plateNum}`);
  document.getElementById("cardModal").style.display = "block";
  document.getElementById("overlay").classList.add("active");

  // TODO: What next after the card modal is shown?
  // Display the plate information
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
    plates.push({ ...doc.data(), id: doc.id });
  });
  // console.log("Plates Query...")
  // console.log(plates);
  showPlatesPreview();
});




// TODO: pills navbar
// console.clear();

const pillContainer = document.querySelector("#pill-tabs");
const pillElement = pillContainer.querySelectorAll("[data-bs-toggle='tab']")
// const progressTab = document.querySelector("#progress-tab")

function tabEventShow(event) {
  const currentItem = this.parentNode;
  const list = Array.from(currentItem.parentNode.children);
  const index = list.indexOf(currentItem);
  const tabId = "tab-" + (index + 1);

  // console.log("Index: " + index);
  // console.log("Tab Id:" + tabId);

  const tabContainer = document.getElementById("tab-container");
  const tabList = Array.from(document.querySelectorAll(".tab-pane"));

  for (let i = 0; i < tabList.length; i++) {

    if (tabList[i].id === tabId) {
      tabList[i].classList.add("active");
      tabList[i].classList.remove("inactive");
    }
    else {
      tabList[i].classList.add("inactive");
      tabList[i].classList.remove("active");
    }

  }

}

pillElement.forEach((tab) => {
  tab.addEventListener("show.bs.tab", tabEventShow)
})

