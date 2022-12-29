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

// GET REAL TIME COLLECTION DATA
onSnapshot(pageRef, (snapshot) => {
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
  // console.log(intro);
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
  // console.log(inst);
  document.querySelector(".instruction").innerHTML =
    `
    <h2 class="text-center">${inst.instruction_title}</h2>
    ${inst.instruction}
    ${inst.notes} 
    <a id="startBtn" class="btn btn-primary mb-3">Start Test</a>   
  `;
  document.getElementById("startBtn").addEventListener("click", startTest);
  // console.log(document.querySelector(".instruction"));
}

function displayTest() {
  document.querySelector(".ishihara-test").style.display = "block";
}

function displayPlates(plate) {
  // console.log("Display Plate");
  // console.log(plate);

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
    <div class="plate-name my-2 text-center">
      <h5>Plate ${plate.plate}</h5>
    </div>
    <img class="ishihara-plate img-fluid" src="${plate.plateURL}"
    " alt="Ishihara Plate ${plate.plate}" />
  `

  // FETCH AND DISPLAY OPTIONS
  // console.log(plate.options);
  let optionsElement = "", option = "", temp = "";
  for (let i = 0; i < plate.options.length; i++) {
    option = plate.options[i];
    // console.log(option);
    // console.log(typeof option)
    // TODO: CATCH ERROR IN OPTION "I DONT KNOW" AND ONCLICK TO SPACES NOT ON
    if (option == "I don't know") {
      temp = "nothing"
      console.log(`temp: ${temp}`);

      optionsElement += `<button type="button" class="btn btn-primary" data-option="nothing" data-selected=false>${temp}</button>`;
    }
    else {
      optionsElement += `<button type="button" class="btn btn-primary" data-option=${option} data-selected=false>${option}</button>`;
    }
  }
  // console.log(optionsElement);
  document.querySelector(".options").innerHTML =
    `
    ${optionsElement}
    <button id="nextBtn" type="button" class="btn btn-dark" data-option="next">Next</button>
  `;

    // FETCH AND DISPLAY PLATE INFORMATION
  let info = "";
  for (let i = 0; i < plate.display.length; i++) {
    info += `<p>${plate.display[i]}</p>`;
  }

  document.querySelector(".display").innerHTML =
    `
      <h5>What did you see?</h5>
      <hr>
      ${info}
  `
  console.log(document.querySelector(".display").innerHTML);

}

function startTest() {

  let counter = 0;
  let answer = [];
  let selectedOption = "", previousOption = "";

  displayTest();

  // FETCH PLATES FROM FIRESTORE
  const q = query(platesRef, orderBy("plate", "asc"));
  onSnapshot(q, (snapshot) => {
    const plates = [];
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
      let parentElement = document.querySelector(".options");

      // console.log(targetElement);
      console.log(`Onclick: ${option}`);

      if (option === "next" && selectedOption != "") {
        console.log(`Selected answer: ${selectedOption}`);
        counter++;
        // PUSH SELECTED OPTION TO THE ANSWER ARRAY
        answer.push(selectedOption);
        console.log(`Pushed to answer[]: ${selectedOption}`);
        console.log(`Answer[]: ${answer}`);
      }
      else if (option === "next" && selectedOption === "") {
        alert("Please select answer");
      }
      else {
        // ONLY CLICK ON BUTTON OPTIONS AND NOT THE SPACES OUTSIDE THE ELEMENTS
        if (targetElement.type === "button") {
          console.log("Clicked on a button");
          selectedOption = option;
          console.log(`Selected option: ${selectedOption}`);
          targetElement.dataset.selected = true;
          targetElement.classList.add("active");
          // TODO: FIX BUTTON COLOR ACTIVE
        }
      }

    // ADD EVENT LISTENER TO PLATE IMAGE
    // document.querySelector(".ishihara-plate").addEventListener("click", () => {
    //   e.preventDefault();
      
      

    // }

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