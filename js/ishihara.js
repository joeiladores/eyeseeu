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
const platesRef = collection(db, 'ishihara-vcd-38');

const answer = [];
// SAMPLE ANSWER SET FOR TESTING ONLY
// NORMAL SAMPLING
// const answer = ['12', '8', '6', '29', '57', '5', '3', '15', '74', '2', '6', '97', '45', '5', '7', '16', '73', 'Nothing', 'Nothing', 'Nothing', 'Nothing', '26', '42', '35', '96', 'Purple and red line', 'Purple and red line', 'Nothing', 'Nothing', 'Blue-green line', 'Blue-green line', 'Orange line', 'Orange line', 'Blue-green and yellow-green line', 'Blue-green and yellow-green line', 'Purple and orange line', 'Purple and orange line', 'Orange line'];
// WEAKVCD SAMPLING PROTAN
// const answer = ['12', '3', '5', '70', '35', '2', '5', '17', '21', 'Nothing', 'Nothing', 'Nothing', 'Nothing', 'Nothing', 'Nothing', 'Nothing', 'Nothing', '5', '2', '45', '73', '6', '2', '5', '6', 'Purple line', 'Purple line', 'A line', 'A line', 'Nothing', 'Nothing', 'Nothing', 'Nothing', 'Purple and red-green line', 'Blue-green and purple line', 'Blue-green and purple line', 'Blue-green and purple line', 'Orange line'];
// WEAK VCD SAMPLEING DEUTRAN
// const answer = ['12', '3', '5', '70', '35', '2', '5', '17', '21', 'Nothing', 'Nothing', 'Nothing', 'Nothing', 'Nothing', 'Nothing', 'Nothing', 'Nothing', '5', '2', '45', '73', '2', '4', '3', '9', 'Red line', 'Red line', 'A line', 'A line', 'Nothing', 'Nothing', 'Nothing', 'Nothing', 'Purple and red-green line', 'Blue-green and purple line', 'Blue-green and purple line', 'Blue-green and purple line', 'Orange line'];

const plates = [];
let currentIndex = 0;
const n_plates = 38;
const n_weakvcd = 6;
let hasSelectedAnswer = false;
let isTestComplete = false;

const q = query(platesRef, orderBy("plate", "asc"));
const snapshot = await getDocs(q);
snapshot.forEach(doc => {
  plates.push(doc.data());
});

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
}

function enableElement(element) {
  element.classList.remove("disabled");
}

function disableElement(element) {
  element.classList.add("disabled");
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

  if (targetElement.classList.contains("plate-Q") && hasSelectedAnswer) {
    hidePlateQ(".plate-Q");
    showPlateA(".plate-A", ".plate-info");
  }
  if (targetElement.classList.contains("plate-A")) {
    hidePlateA(".plate-A", ".plate-info");
    showPlateQ(".plate-Q");
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

// ADD EVETN LISTENER TO THE START BUTTON, OPEN THE PILL NAV TEST AND START TEST
document.getElementById("startTestBtn").addEventListener("click", () => {
  activateElement(document.getElementById("nav-pill-test"));
  deactivateElement(document.getElementById("nav-pill-inst"));
  activateElement(document.getElementById("tab-3"));
  deactivateElement(document.getElementById("tab-2"));
  startTest();
});

document.getElementById("nav-pill-test").addEventListener("click", startTest());

function styleOptionBtns(current_target, target_element) {

  const otherOptions = Array.from(current_target.children);
  // console.log(otherOptions);

  otherOptions.forEach((child) => {
    if (child != target_element) child.classList.remove("active");
    else child.classList.add("active");
  });

}

function startTest() {

  let selectedOption = "";

  // DISPLAY INITIAL PLATE 1
  displayPlates(plates[0]);

  // ADD EVENT LISTENERS TO OPTIONS
  document.querySelector(".options").addEventListener("click", (e) => {

    let targetElement = e.target;
    let option = targetElement.dataset.option;

    console.log("Index: " + currentIndex);

    if (option === "next" && selectedOption != "") {

      // PUSH ANSWER TO THE PLATES ARRAY      
      answer.push(selectedOption);
      hidePlateA(".plate-A", ".plate-info");

      currentIndex++;

      // RESET SELECTED OPTION TO ""
      selectedOption = "";
      hasSelectedAnswer = false;

      console.log(answer);
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
  if (answer[0] === plates[0].normal || answer[0] === plates[0].weak_vcd) {
    count_normal++;
  }
  else {
    console.log("wrong at index: 0");
    count_badv++;
  }

  // CHECKING PLATES 2 - 37
  for (let i = 1; i < n_plates - 1; i++) {

    if (answer[i] === plates[i].normal) {
      count_normal++;
    }
    else {
      if (answer[i] === plates[i].weak_vcd) {
        count_weakv++;
      }
      else if (plates[i].subtype === "vcd") {
        if (answer[i] === plates[i].protanopia) {
          count_weakv++;
          count_protan++;
        }
        else if (answer[i] === plates[i].deuteranopia) {
          count_weakv++;
          count_deuteran++;
        }
        else {
          console.log("wrong at index: " + i);
          count_badv++;
        }
      }
      else {
        console.log("wrong at index: " + i);
        count_badv++;
      }
    }
  }

  // CHECKING FOR PLATE 38
  if (answer[n_plates - 1] === plates[n_plates - 1].normal && answer[n_plates - 1] === plates[n_plates - 1].weak_vcd) {
    count_normal++;
  }
  else {
    console.log("wrong at index: " + n_plates - 1);
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

  console.log(result_info);

  console.log("count_normal " + result_info.count_normal);
  console.log("count_weakv " + result_info.count_weakv);
  console.log("count_protan " + result_info.count_protan);
  console.log("count_deuteran " + result_info.count_deuteran);
  console.log("count_badv " + result_info.count_badv);
  console.log("p_normal " + result_info.p_normal);
  console.log("p_weakv " + result_info.p_weakv);
  console.log("p_protan " + result_info.p_protan);
  console.log("p_deuteran " + result_info.p_deuteran);
  console.log("p_badv " + result_info.p_badv);

  // Patients with more than two incorrect plates are considered to have color vision deficiency.
  if(result_info.count_normal >= n_plates - 2) {
    result_desc1 = "NORMAL COLOR VISION";
    result_desc2 = "You can see up to one million disctict shades of color!";
  }
  else if(result_info.count_weakv > 2 || result_info.count_badv > 2) {
    result_desc1 = "According to this test you have some form of red-green color blindness.";
    result_desc2 = "You did not correctly identify the hidden figures in more than two test condition. You may have difficulty distinguishing many colors and it most likely impacts your daily life. Be sure to consult with your eye doctor to explore options to improve your color vision!";
  } 
  else {

  }

  console.log(result_desc1);
  console.log(result_desc2);

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
    result = answer[i] === plates[i].normal ? "Correct" : "Wrong";
    table_body.innerHTML +=
      `
        <tr>
          <td>${plates[i].plate}</td>
          <td>${plates[i].type}</td>
          <td>${plates[i].normal}</td>
          <td>${plates[i].weak_vcd}</td>
          <td>${answer[i]}</td>
          <td>${result}</td>
        </tr>
        `
  }
}

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

  const selectedPlate = plates.find(current_plate => current_plate.plate === parseInt(plateNum));

  document.getElementById("card-modal-title").innerHTML = `Plate ${plateNum}`;

  document.querySelector(".modal-plate-container").innerHTML =
    `
    <img
      src="${selectedPlate.plateURL}"
      class="plate-Q2 img-fluid rounded-start" alt="..." />
    <img
      src="${selectedPlate.plateURL2}"
      class="plate-A2 img-fluid rounded-start" alt="..." style="display: none" />
  `

  document.querySelector(".question-message").innerHTML =
    `
    <h5 class="card-title">What do you see?</h5>
    <p class="card-text">Click the plate to check.</p>
  `

  document.getElementById("cardModal").style.display = "block";
  document.getElementById("overlay").classList.add("active");

  displayPlateInfo(".answer-plate-info", selectedPlate.display);
  // DEFAULT DISPLAY OF PLATE INFO
  document.querySelector(".question-message").style.display = "block";
  document.querySelector(".answer-plate-info").style.display = "none";
}

function closeCardModal() {
  document.getElementById("cardModal").style.display = "none";
  document.getElementById("overlay").classList.remove("active");
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

document.querySelector(".closeBtn").onclick = () => closeCardModal();

// EVENT FOR CARD PREVIEW
document.getElementById("plate-cards-preview").addEventListener("click", (e) => {
  const card = e.target;
  if (card.classList.contains("card-img-bottom")) {
    // console.log(card.dataset.plate);
    showCardModal(card.dataset.plate);
  }
});

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

// STICKY NAV PILL
// const navbarHeight = document.getElementById("main-navbar").offsetHeight;
// const parallaxTop = document.getElementById("parallax-section").offsetHeight;
// const pillNavbarHeight = document.getElementById("pill-navbar-container").offsetHeight;
// const parallaxTop = document.querySelector(".parallax-ishihara").offsetTop;
// console.log(navbarHeight);
// console.log(parallaxTop);
// console.log(parallaxTop + navbarHeight);
// console.log(pillNavbarHeight);

// window.addEventListener("scroll", function () {
//   if (window.pageYOffset > parallaxTop - navbarHeight) {
//     document.getElementById("pill-navbar-container").classList.add("sticky-nav");
//     let elementsBelow = document.getElementsByClassName("relative-element");
//     for (let i = 0; i < elementsBelow.length; i++) {
//       elementsBelow[i].classList.add("relative-element");
//     }
//   }
//   else {
//     document.getElementById("pill-navbar-container").classList.remove("sticky-nav");
//     let elementsBelow = document.getElementsByClassName("relative-element");
//     for (let i = 0; i < elementsBelow.length; i++) {
//       elementsBelow[i].classList.remove("relative-element");
//     }
//   }

// });

