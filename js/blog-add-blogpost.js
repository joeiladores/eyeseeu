import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'

// Add Firebase products that you want to use
import { 
  getFirestore, 
  collection, 
  // getDocs,  
  onSnapshot, addDoc, getDoc, doc,
  // deleteDoc,
  query, where, orderBy
  // serverTime
} 
  from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'

import { getStorage, ref } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js'

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
const q = query(blogRef, where("blog_id", ">", 0), orderBy("blog_id", "asc"));
onSnapshot(q, (snapshot) => {
  let blogs = [];
  snapshot.docs.forEach((doc) => {
    blogs.push({ ...doc.data(), id: doc.id })
  });
  console.log(blogs);
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
    content_preview: blogForm.contentPreview.value,
    cover_image: blogForm.coverImage.value,
    publish_date: pub_date,
    author: blogForm.author.value,
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


 