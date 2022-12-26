import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'

// Add Firebase products that you want to use
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
const storage = getStorage(app);

// Collection Reference
const blogRef = collection(db, 'blog');

// GET COLLECTION DATA
// getDocs(blogRef)
//   .then((snapshot) => {
//     let blogs = [];
//     snapshot.docs.forEach((doc) => {
//       blogs.push({ ...doc.data(), id: doc.id })
//     });
//     console.log(blogs);

//   })
//   .catch(err => {
//     console.log(err.message);
//   });

// GET REAL TIME COLLECTION DATA
// onSnapshot(blogRef, (snapshot) => {
//   let blogs = [];
//   snapshot.docs.forEach((doc) => {
//     blogs.push({ ...doc.data(), id: doc.id })
//   });
//   console.log(blogs);
// });


// QUERIES
// const q = query(blogRef, where("blog_id", ">", 0), orderBy("blog_id", "asc"));
// onSnapshot(q, (snapshot) => {
//   let blogs = [];
//   snapshot.docs.forEach((doc) => {
//     blogs.push({ ...doc.data(), id: doc.id })
//   });
//   console.log(blogs);
// }); 


// UPLOAD IMAGE FROM FORM
document.getElementById("btnUpload").addEventListener("click", (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("uploadImage");
  let fileItem = fileInput.files[0];
  let fileName = fileItem.name;
  let metadata = fileItem.meta;
  let percentValue;

  console.log(`fileName: ${fileName}`);

  const storageRef = ref(storage, "blog-photos/" + fileName);
  const uploadTask = uploadBytesResumable(storageRef, fileItem, metadata);

  uploadTask.on('state_changed',
    (snapshot) => {
      percentValue = Math.floor(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + percentValue + '% done, ' + snapshot.totalBytes);
    },
    (error) => {
      console.log('Upload error: ' + error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          console.log('downloadURL: ', downloadURL);
          document.getElementById("uploadedImageURL").value = downloadURL;
        });
    }
  );

});


// ADDING DOCUMENTS
const blogForm = document.getElementById("blog-form");
blogForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let pub_date = new Date(blogForm.pubdate.value);
  console.log(`pub_date: ${pub_date}`)

  addDoc(blogRef, {

    blog_id: parseInt(blogForm.blogId.value),
    title: blogForm.title.value,
    cover_image: blogForm.uploadedImageURL.value,
    publish_date: pub_date,
    author: blogForm.author.value,
    content_preview: blogForm.contentPreview.value,
    content: blogForm.content.value,
  })
    .then(() => {
      blogForm.reset();
    });


});



// DELETE DOCUMENTS TODO: make a delete-blog-form where it accepts ID and a submit button
// const deleteBlogForm = document.getElementById("delete-blog-form");
// deleteBlogForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const blogRef = doc(db, "blog", deleteBlogForm.id.value);

//   deleteDoc(blogRef)
//     .then(() => {
//       deleteBlogForm.reset()

//     });
// });





// GET A SINGLLE DOCUMENT
// const docRef = doc(db, "blog", "bVlwd1p27bsFmObMDgfo");

// getDoc(docRef)
//   .then((doc) => {
//     console.log(doc.data(), doc.id)
//   });


// GET A SINGLE DATA ON REALTIME
// onSnapshot(docRef, (doc) => {
//   console.log(doc.data(), doc.id);
// }); 




// GET BLOGS TIMESTAMP MONTH
// const q = query(blogRef, where("publish_date", ">", 0), orderBy("blog_id", "asc"));
onSnapshot(blogRef, (snapshot) => {
  let blogMonths = [];
  let blogs = [];
  let fTimestamp, jsDate, month, month_num, year, month_year;
  let containsMonthYear;

  snapshot.docs.forEach((doc) => {
    // blogs.push({ publish_date: doc.data().publish_date })   
    fTimestamp = doc.data().publish_date;
    jsDate = fTimestamp.toDate();
    month = jsDate.toLocaleString('default', { month: 'long' })
    year = jsDate.toLocaleString('default', { year: 'numeric' })
    month_num = jsDate.toLocaleString('default', { month: 'numeric' });
    month_year = month + " " + year;

    // console.log(fTimestamp);
    // console.log(jsDate);
    // console.log(month);

    blogs.push({ ...doc.data(), publish_date: jsDate, id: doc.id })

    containsMonthYear = (blogMonths, month_year) => {
      return blogMonths.some(object => object.month_year === month_year)
    }

    if (!containsMonthYear(blogMonths, month_year)) {
      blogMonths.push({ month_num: month_num, month: month, year: year, month_year: month_year });
    }

  });

  // SORT MONTH BY DATE - START FROM LATEST YEAR, MONTH
  blogMonths.sort((a, b) => b.year - a.year);
  blogMonths.sort((a, b) => a.month_num - b.month_num);

  // SORT BLOG BY DATE - STARTS FROM THE LATEST BLOG
  blogs.sort((a, b) => b.publish_date - a.publish_date);
  console.log(blogMonths);
  console.log(blogs);


}); 