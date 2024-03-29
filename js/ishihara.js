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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const platesRef = collection(db, 'ishihara-vcd-38');

const answers = [];
const plates = [];
let currentIndex = 0;
const n_plates = 38;
const n_weakvcd = 6;
let hasSelectedAnswer = false;

const q = query(platesRef, orderBy("plate", "asc"));
const snapshot = await getDocs(q);
snapshot.forEach(doc => {
  plates.push(doc.data());
});

function startTest() {

  let selectedOption = "";
  currentIndex = 0;

  // DISPLAY INITIAL PLATE 1
  displayPlates(plates[0]);

  // ADD EVENT LISTENERS TO OPTIONS
  document.querySelector(".options").addEventListener("click", (e) => {

    let targetElement = e.target;
    let option = targetElement.dataset.option;

    if (option === "next" && selectedOption != "") {

      answers.push(selectedOption);
      hidePlateA(".plate-A", ".plate-info");

      currentIndex++;

      // RESET SELECTED OPTION
      selectedOption = "";
      hasSelectedAnswer = false;
    }
    else if (option === "next" && selectedOption === "") {
      showModal();
    }
    else if (targetElement.classList.contains("optionBtn")) {
      // ONLY CLICK ON BUTTON OPTIONS AND NOT OTHER CHILD ELEMENTS
      selectedOption = option;
      styleOptionBtns(e.currentTarget, targetElement);
      hasSelectedAnswer = true;

      return;
    }
    else return;

    // DISPLAY NEZXT PLATE EVERY CLICK ON NEXT BUTTON
    if (currentIndex < n_plates) {
      displayPlates(plates[currentIndex]);
    }
    // WHEN THE TEST IS COMPLETE
    else {
      showTestCompleteModal();
    }
  });
}

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
      <h4>Plate ${plate.plate}</h4>
    </div>
    <img id="plate-Q" class="plate-Q ishihara-plate-img img-fluid" src="${plate.plateURL}"
      alt="Ishihara Plate ${plate.plate}" data-plate="${plate.plate}" data-url="plateURL"/>
    <img id="plate-A" class="plate-A ishihara-plate-img img-fluid" src="${plate.plateURL2}" style="display: none"
      alt="Ishihara Plate ${plate.plate}" data-plate="${plate.plate}" data-url="plateURL2"/>
  `

  // GET AND DISPLAY OPTIONS
  let optionsElement = "", option = "";
  for (let i = 0; i < plate.options.length; i++) {
    option = plate.options[i];

    if (option === "I don’t know") {
      optionsElement += `<div class="optionBtn btn" data-option="Nothing">${option}</div>`;
    }
    else {
      optionsElement += `<div class="optionBtn btn" data-option='${option}'>${option}</div>`;
    }
  }

  document.querySelector(".options").innerHTML =
    `
    ${optionsElement}
    <button id="nextBtn" class="btn btn-dark" data-option="next">Next</button>
  `;

  // GET AND DISPLAY PLATE INFORMATION, INITIALLY NOT SHOWN BY DEFAULT
  displayPlateInfo(".plate-info", plate.display);

}

function displayPlateInfo(element, info) {
  let infoStr = "";
  for (let i = 0; i < info.length; i++) {
    infoStr += `<p>${info[i]}</p>`;
  }
  document.querySelector(element).innerHTML =
    `
      <h5>What did you see?</h5>
      <hr>
      ${infoStr}
  `
}

function styleOptionBtns(current_target, target_element) {

  const otherOptions = Array.from(current_target.children);

  otherOptions.forEach((child) => {
    if (child != target_element) child.classList.remove("active");
    else child.classList.add("active");
  });

}

// ANSWER DATASET FOR TESTING OF RESULT
function computeResult() {

  let count_normal = 0;
  let count_weakv = 0;
  let count_protan = 0;
  let count_deuteran = 0;
  let count_badv = 0;
  let p_normal = 0;
  let p_weakv = 0;
  let p_protan = 0;
  let p_deuteran = 0;
  let p_badv = 0;

  // CHECKING PLATE 1
  if (answers[0] === plates[0].normal || answers[0] === plates[0].weak_vcd) {
    count_normal++;
  }
  else {
    count_badv++;
  }

  // CHECKING PLATES 2 - 37
  for (let i = 1; i < n_plates - 1; i++) {

    if (answers[i] === plates[i].normal) {
      count_normal++;
    }
    else {
      if (answers[i] === plates[i].weak_vcd) {
        count_weakv++;
      }
      else if (plates[i].subtype === "vcd") {
        if (answers[i] === plates[i].protanopia) {
          count_weakv++;
          count_protan++;
        }
        else if (answers[i] === plates[i].deuteranopia) {
          count_weakv++;
          count_deuteran++;
        }
        else {
          count_badv++;
        }
      }
      else {
        count_badv++;
      }
    }
  }

  // CHECKING FOR PLATE 38
  if (answers[n_plates - 1] === plates[n_plates - 1].normal && answers[n_plates - 1] === plates[n_plates - 1].weak_vcd) {
    count_normal++;
  }
  else {
    count_badv++;
  }

  p_normal = Math.floor((count_normal / (n_plates)) * 100);
  p_weakv = Math.floor((count_weakv / (n_plates - 2)) * 100);
  p_protan = Math.floor((count_protan / n_weakvcd) * 100);
  p_deuteran = Math.floor((count_deuteran / n_weakvcd) * 100);
  p_badv = Math.floor((count_badv / n_plates) * 100);

  const result = {
    count_normal: count_normal,
    count_weakv: count_weakv,
    count_protan: count_protan,
    count_deuteran: count_deuteran,
    count_badv: count_badv,
    p_normal: p_normal,
    p_weakv: p_weakv,
    p_protan: p_protan,
    p_deuteran: p_deuteran,
    p_badv: p_badv
  }
  return result;
}

// DISPLAY RESULTS IN A RESPONSIVE TABLE
function showResult() {

  let result = "";
  const result_diag = document.getElementById("result-diag");
  const result_bar = document.getElementById("result-bar");
  const table_head = document.getElementById("table-head");
  const table_body = document.getElementById("table-body");
  const result_info = computeResult();
  let result_desc1 = "";
  let result_desc2 = "";

  // Patients with more than two incorrect plates are considered to have color vision deficiency.
  if (result_info.count_normal >= n_plates - 2) {
    result_desc1 = "NORMAL COLOR VISION";
    result_desc2 = "You can see up to one million disctict shades of color!";
  }
  if (result_info.count_weakv > 2 || result_info.count_badv > 2) {
    result_desc1 = "According to this test you have some form of red-green color blindness.";
    result_desc2 = "You did not correctly identify the hidden figures in more than two test condition. You may have difficulty distinguishing many colors and it most likely impacts your daily life. Be sure to consult with your eye doctor to explore options to improve your color vision!";
  }

  result_diag.innerHTML =
    `
      <div class="alert alert-primary fs-6" role="alert">${result_desc1}</div>   
      <div>${result_desc2}</div>
    `

  result_bar.innerHTML =
    `
      <div>TRICHROMATISM (Normal Vision): </div>
        <div class="progress rounded-0">
          <div class="progress-bar bg-warning text-dark" role="progressbar" aria-label="Basic example" style="width: ${result_info.p_normal}%" aria-valuenow="${result_info.p_normal}"
            aria-valuemin="0" aria-valuemax="100">${result_info.p_normal}%</div>
        </div>
        <div class="mt-3">RED GREEN COLOR DIFICIENCY</div>
        <div>(Insufficient distinction between shades of red and green):</div>
        <div class="progress rounded-0">
          <div class="progress-bar bg-warning text-dark" role="progressbar" aria-label="Basic example" style="width: ${result_info.p_weakv}%" aria-valuenow="${result_info.p_weakv}"
            aria-valuemin="0" aria-valuemax="100">${result_info.p_weakv}%</div>
        </div>
          <div class="mt-3">PROTANOPIA (Not recognized color red): </div>
        <div class="progress rounded-0">
          <div class="progress-bar bg-primary" role="progressbar" aria-label="Basic example" style="width: ${result_info.p_protan}%" aria-valuenow="${result_info.p_protan}"
            aria-valuemin="0" aria-valuemax="100">${result_info.p_protan}%</div>
        </div>
        <div class="mt-3">DEUTERANOPIA (Not recognized color green): </div>
        <div class="progress rounded-0">
          <div class="progress-bar bg-primary" role="progressbar" aria-label="Basic example" style="width: ${result_info.p_deuteran}%" aria-valuenow="${result_info.p_deuteran}"
            aria-valuemin="0" aria-valuemax="100">${result_info.p_deuteran}%</div>
        </div>     
        <div class="mt-3">UNIDENTIFIED ANOMALY: </div>
        <div class="progress rounded-0">
          <div class="progress-bar bg-warning text-dark" role="progressbar" aria-label="Basic example" style="width: ${result_info.p_badv}%" aria-valuenow="${result_info.p_badv}"
            aria-valuemin="0" aria-valuemax="100">${result_info.p_badv}%</div>
      </div>
  `

  table_head.innerHTML =
    `
    <tr>
      <th scope="col">Plate</th>
      <th scope="col">Type</th>      
      <th scope="col">Normal</th>
      <th scope="col">Red-Green Deficiency</th>
      <th scope="col">Answer</th>
      <th scope="col">Result</th>
    </tr>  
    `

  for (let i = 0; i < n_plates; i++) {
    result = answers[i] === plates[i].normal ? "Correct" : "Wrong";
    table_body.innerHTML +=
      `
        <tr>
          <td>${plates[i].plate}</td>
          <td>${plates[i].type}</td>
          <td>${plates[i].normal}</td>
          <td>${plates[i].weak_vcd}</td>
          <td>${answers[i]}</td>
          <td>${result}</td>
        </tr>
        `
  }
}

function hidePlateQ(imageElement) {
  document.querySelector(imageElement).style.display = "none";
}

function showPlateQ(imageElement) {
  document.querySelector(imageElement).style.display = "block";
}

function showPlateA(imageElement, infoElement) {
  document.querySelector(imageElement).style.display = "block";
  document.querySelector(infoElement).style.display = "block";
}

function hidePlateA(imageElement, infoElement) {
  document.querySelector(imageElement).style.display = "none";
  document.querySelector(infoElement).style.display = "none";
}

function showModal() {
  document.getElementById("errModal").style.display = "block";
  document.getElementById("overlay").classList.add("active");
}

function showTestCompleteModal() {
  document.getElementById("testCompleteModal").style.display = "block";
  document.getElementById("overlay").classList.add("active");
  document.getElementById("restartTestBtn").style.display = "block";
}

function enableElement(element) {
  element.classList.remove("disabled");
}

function disableElement(element) {
  element.classList.add("disabled");
}

function activateElement(element) {
  element.classList.add("active");
  element.classList.remove("inactive");
}

function deactivateElement(element) {
  element.classList.add("inactive");
  element.classList.remove("active");
}

function closeCardModal() {
  document.getElementById("cardModal").style.display = "none";
  document.getElementById("overlay").classList.remove("active");
}

// EVENT LISTENER FOR RESTART TEST BUTTON
document.getElementById("restartTestBtn").addEventListener("click", () => {
  const lengthPlates = plates.length;
  const lengthAnswers = answers.length;

  for (let i = 0; i < lengthAnswers; i++) {
    answers.pop();
  }
  disableElement(document.getElementById("nav-pill-result"));
  hasSelectedAnswer = false;

  startTest();

  document.getElementById("restartTestBtn").style.display = "none";

});

// SDD EVENT LISTNER TO THE MODAL CLOSE BUTTON
document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("errModal").style.display = "none";
  document.getElementById("overlay").classList.remove("active");
});

// ADD EVENT LISTERNER TO THE PLATE IMAGE
document.querySelector(".plate-container").addEventListener("click", (e) => {

  let targetElement = e.target;
  // let elementID = targetElement.id;

  if (targetElement.classList.contains("plate-Q") && hasSelectedAnswer) {
    hidePlateQ(".plate-Q");
    showPlateA(".plate-A", ".plate-info");
  }
  if (targetElement.classList.contains("plate-A")) {
    hidePlateA(".plate-A", ".plate-info");
    showPlateQ(".plate-Q");
  }
});

// ADD EVETN LISTENER TO THE START BUTTON, OPEN THE PILL NAV TEST AND START TEST
document.getElementById("startTestBtn").addEventListener("click", () => {
  activateElement(document.getElementById("nav-pill-test"));
  deactivateElement(document.getElementById("nav-pill-inst"));
  activateElement(document.getElementById("tab-3"));
  deactivateElement(document.getElementById("tab-2"));
  startTest();
});

document.getElementById("nav-pill-test").addEventListener("click", startTest());

// EVENT LISTENER FOR MORE BUTTON TO VIEW DETAILED ANSWER RESULT
document.getElementById("moreDetailsBtn").addEventListener("click", () => {
  activateElement(document.getElementById("table-tab"));
  deactivateElement(document.getElementById("moreDetailsBtn"));
});

// ADD EVETN LISTENER TO THE OPENRESULTBUTTON, OPEN THE PILL NAV RESULT AND START SHOWING RESULT
document.getElementById("openResultBtn").addEventListener("click", () => {
  deactivateElement(document.getElementById("nav-pill-test"));
  enableElement(document.getElementById("nav-pill-result"));
  activateElement(document.getElementById("nav-pill-result"));
  activateElement(document.getElementById("tab-4"));
  deactivateElement(document.getElementById("tab-3"));
  showResult();
  document.getElementById("testCompleteModal").style.display = "none";
  document.getElementById("overlay").classList.remove("active");
});

// EVENT WHEN PILL NAVBAR RESULT IS SELECTED
document.getElementById("nav-pill-plates").addEventListener("click", showPlatesPreview());

// EVENT FOR PILL NAVBAR SELECTION
const pillContainer = document.querySelector("#pill-tabs");
const pillElement = pillContainer.querySelectorAll("[data-bs-toggle='tab']")

function tabEventShow(event) {
  const currentItem = this.parentNode;
  const list = Array.from(currentItem.parentNode.children);
  const index = list.indexOf(currentItem);
  const tabId = "tab-" + (index + 1);

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


// TAB 5 *********************************************************************************
// DISPLAY THE PLATES PREVIEW CARDS
function showPlatesPreview() {

  plates.forEach((plate) => {

    document.getElementById("plate-cards-preview").innerHTML +=
      `
      <div class="col">
        <div class="card shadow-lg rounded-3 pb-1">
          <div class="card-body p-0 pt-2">
            <h5 class="card-title text-center m-0">Plate ${plate.plate}</h5>
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

  const modal_card_title = document.getElementById("card-modal-title");
  const modal_plate_container = document.querySelector(".modal-plate-container");
  const question_mssg = document.querySelector(".question-message");
  const answer_plate_info = document.querySelector(".answer-plate-info")
  const modal_card = document.getElementById("cardModal");
  const modal_overlay = document.getElementById("overlay");
  const selectedPlate = plates.find(current_plate => current_plate.plate === parseInt(plateNum));

  modal_card_title.innerHTML = `Plate ${plateNum}`;

  modal_plate_container.innerHTML =
    `
    <img
      src="${selectedPlate.plateURL}"
      class="plate-Q2 img-fluid rounded-start" alt="..." />
    <img
      src="${selectedPlate.plateURL2}"
      class="plate-A2 img-fluid rounded-start" alt="..." style="display: none" />
  `

  question_mssg.innerHTML =
    `
    <h5 class="card-title">What do you see?</h5>
    <p class="card-text">Click the plate to check.</p>
  `

  modal_card.style.display = "block";
  modal_overlay.classList.add("active");

  displayPlateInfo(".answer-plate-info", selectedPlate.display);
  // DEFAULT DISPLAY OF PLATE INFO
  question_mssg.style.display = "block";
  answer_plate_info.style.display = "none";
}

// ADD EVENT LISTERNER TO THE PLATE MODAL IMAGE
document.querySelector(".modal-plate-container").addEventListener("click", (e) => {

  let targetElement = e.target;

  if (targetElement.classList.contains("plate-Q2")) {
    hidePlateQ(".plate-Q2");
    document.querySelector(".question-message").style.display = "none";
    showPlateA(".plate-A2", ".answer-plate-info");
  }
  if (targetElement.classList.contains("plate-A2")) {
    hidePlateA(".plate-A2", ".answer-plate-info");
    showPlateQ(".plate-Q2");
    document.querySelector(".question-message").style.display = "block";
  }
});

// EVENT FOR CARD MODAL CLOSE BUTTON
document.querySelector(".closeBtn").onclick = () => closeCardModal();

// EVENT FOR CARD PREVIEW
document.getElementById("plate-cards-preview").addEventListener("click", (e) => {
  const card = e.target;
  if (card.classList.contains("card-img-bottom")) {
    showCardModal(card.dataset.plate);
  }
});


