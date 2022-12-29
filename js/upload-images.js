import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'

// Add Firebase products that you want to use
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
// const db = getFirestore(app);
const storage = getStorage(app);






// UPLOAD IMAGE
const blogForm = document.getElementById("blog-form");
blogForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("coverImage");
  let fileItem = fileInput.files[0];
  let fileName = fileItem.name;
  const uploadPercentage = document.querySelector(".uploadPercentage");
  const progress = document.querySelector(".progress");
  let percentValue;
  const image = document.querySelector(".image");

  // console.log(`fileName: ${fileName}`);

  const storageRef = ref(storage, "ishihara-page/" + fileName);
  const uploadTask = uploadBytesResumable(storageRef, fileItem);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      percentValue = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      console.log('Upload is ' + percentValue + '% done, ' + snapshot.bytesTransferred + " bytes");
      uploadPercentage.innerHTML = percentValue + "%";
      progress.style.width = percentValue + "%";
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;

        // ...

        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          console.log('File available at', downloadURL);

          if (downloadURL != "") {
            image.setAttribute("src", downloadURL);
            image.style.display = "block";
            document.getElementById("url").value = downloadURL;
          }
        });
    }
  );



});