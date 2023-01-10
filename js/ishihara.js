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

// SAMPLE ANSWER SET FOR TESTING ONLY
let answer = [];
answer = ['12', '13', '14', '15', '16', '17'];
const plates = [];
let currentIndex = 0;
let n_plates = 38;
let hasSelectedAnswer = false;

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
      <h5>Plate ${plate.plate}</h5>
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
      optionsElement += `<div class="optionBtn btn" data-option="Nothing" data-selected=false>${option}</div>`;
    }
    else {
      optionsElement += `<div class="optionBtn btn" data-option=${option} data-selected=false>${option}</div>`;
    }
  }

  document.querySelector(".options").innerHTML =
    `
    ${optionsElement}
    <button id="nextBtn" class="btn btn-dark" data-option="next">Next</button>
  `;

  // GET AND DISPLAY PLATE INFORMATION, INITIALLY NOT SHOWN BY DEFAULT
  displayPlateInfo(plate.display);
  
}

function displayPlateInfo(info) {
  console.log(info);
  let infoStr = "";
  for (let i = 0; i < info.length; i++) {
    infoStr += `<p>${info[i]}</p>`;
  }
  document.querySelector(".plate-info").innerHTML =
    `
      <h5>What did you see?</h5>
      <hr>
      ${infoStr}
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

// ADD EVETN LISTENER TO THE START BUTTON, OPEN THE PILL NAV TEST AND START TEST
document.getElementById("startBtn").addEventListener("click", () => {
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
    console.log("Selected option: " + option);

    if (option === "next" && selectedOption != "" && currentIndex === n_plates - 1) {
      console.log("End of plates");
      console.log(`Final Answer[]: ${answer}`);

      // TODO: COMPUTE RESULTS AND DISOPLAY A RESPONSIVE TABLE
      showResult();
    }
    else if (option === "next" && selectedOption != "") {

      // PUSH ANSWER TO THE PLATES ARRAY
      plates[currentIndex].answer = selectedOption;
      console.log(answer);
      hidePlateA();

      currentIndex++;

      // RESET SELECTED OPTION TO ""
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

      // TODO: FIX BUTTON COLOR ACTIVE
      return;
    }
    else return;

    // DISPLAY NEZXT PLATE EVERY CLICK ON NEXT BUTTON
    displayPlates(plates[currentIndex]);
  });


}

function showResult() {

  let result = "";

  activateElement(document.getElementById("nav-pill-result"));
  deactivateElement(document.getElementById("nav-pill-test"));
  activateElement(document.getElementById("tab-4"));
  deactivateElement(document.getElementById("tab-3"));

  // DISPLAY RESULTS IN A TABLE
  document.getElementById("table-head").innerHTML =
    `
    <tr>
      <th scope="col">Plate</th>
      <th scope="col">Type</th>
      <th scope="col">Answer</th>
      <th scope="col">Correct</th>
      <th scope="col">Weak VCD</th>
      <th scope="col">Result</th>
    </tr>  
    `

  // for(let i = 0; i < n_plates; i++) {

  //   result = compute(plates[i].normal, plates[i].weak_vcd, plates[i].answer)

  //   document.getElementById("table-body").innerHTML +=
  //     `
  //     <tr>
  //       <td>${plates[i].plate}</td>
  //       <td>${plates[i].type}</td>
  //       <td>${plates[i].answer}</td>
  //       <td>${plates[i].normal}</td>
  //       <td>${plates[i].weak_vcd}</td>
  //       <td>${result}</td>
  //     </tr>
  //     `
  // }


  plates.forEach((plate) => {

    result = computeResult(plate.normal, plate.weak_vcd, plate.answer)

    document.getElementById("table-body").innerHTML +=
      `
        <tr>
          <td>${plate.plate}</td>
          <td>${plate.type}</td>
          <td>${plate.answer}</td>
          <td>${plate.normal}</td>
          <td>${plate.weak_vcd}</td>
          <td>${result}</td>
        </tr>
        `
  });

}

function computeResult(normal, weakvcd, answer) {
  if (answer === normal) return "correct";
  else return "wrong";
}

document.getElementById("nav-pill-plates").addEventListener("click", showPlatesPreview());

// FOR THE PLATES PREVIEW CARDS
function showPlatesPreview() {

  plates.forEach((plate) => {

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

  // console.log("In showCardModal...");
  // console.log("Plate num: " + plateNum);
  // console.log(typeof parseInt(plateNum));

  const selectedPlate = plates.find(current_plate => current_plate.plate === parseInt(plateNum));

  // console.log(selectedPlate);
  document.getElementById("cardModal").style.display = "block";
  document.getElementById("overlay").classList.add("active");

  document.querySelector(".modal-plate-container").innerHTML =
  `
    <img
      src="${selectedPlate.plateURL}"
      class="plate-Q img-fluid rounded-start" alt="..." />
    <img
      src="${selectedPlate.plateURL2}"
      class="plate-A img-fluid rounded-start" alt="..." style="display: none" />
  ` 
  document.querySelector(".plate-info").innerHTML =
  `

  
  `

  // TODO: What next after the card modal is shown?
  // Display the plate information
}

// function hidePlateQ() {
//   document.querySelector(".plate-Q").style.display = "none";
// }

// function showPlateA() {
//   document.querySelector(".plate-A").style.display = "block";
//   document.querySelector(".plate-info").style.display = "block";
// }

// function showPlateQ() {
//   document.querySelector(".plate-Q").style.display = "block";
// }

// function hidePlateA() {
//   document.querySelector(".plate-A").style.display = "none";
//   document.querySelector(".plate-info").style.display = "none";
// }

// ADD EVENT LISTERNER TO THE PLATE MODAL IMAGE
document.querySelector(".modal-plate-container").addEventListener("click", (e) => {

  let targetElement = e.target;

  if (targetElement.classList.contains("plate-Q")) {
    hidePlateQ();
    showPlateA();
  }
  if (targetElement.classList.contains("plate-A")) {
    hidePlateA();
    showPlateQ();
  }
});

function closeCardModal() {
  document.getElementById("cardModal").style.display = "none";
  document.getElementById("overlay").classList.remove("active");
}

document.querySelector(".closeBtn").onclick = () => closeCardModal();

// EVENT FOR CARD PREVIEW
document.getElementById("plate-cards-preview").addEventListener("click", (e) => {
  const card = e.target;
  if (card.classList.contains("card-img-bottom")) {
    // console.log(card.dataset.plate);
    showCardModal(card.dataset.plate);
  }
});

// PILL NAVBAR EVENTS
const pillContainer = document.querySelector("#pill-tabs");
const pillElement = pillContainer.querySelectorAll("[data-bs-toggle='tab']")

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


// ANSWER DATASET FOR TESTING OF RESULT
function testAnswerData() {





}

testAnswerData();
