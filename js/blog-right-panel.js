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
  getStorage, ref, listAll,
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

window.onload = function () {
  displayBlogs();
  displayStickyBlogFilter()
}

function displayBlogs() {

  const q = query(blogRef, orderBy("publish_date", "desc"));
  onSnapshot(q, (snapshot) => {
    // let blogs = [];
    let fTimestamp, jsDate, jsDateString;

    snapshot.docs.forEach((doc) => {
      fTimestamp = doc.data().publish_date;
      jsDate = fTimestamp.toDate();
      jsDateString = jsDate.toLocaleString('default', { dateStyle: 'long' });

      // console.log(jsDateString);

      // blogs.push({ ...doc.data(), publish_date: jsDateString, id: doc.id })

      let blog = doc.data();

      document.getElementById("blog").innerHTML +=
        `
        <div class="card mb-3 shadow-lg rounded-3">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${blog.cover_image}" class="card-image img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${blog.title}</h5>
                ${blog.content_preview}
                <a href="#" class="btn btn-primary mb-3">Read More</a>
                <p class="card-text"><small class="text-muted">${jsDateString}</small></p>
              </div>
            </div>
          </div>
        </div>

    `
    });

  });

}

function displayFilteredBlogs(month, year) {

  const q = query(blogRef, orderBy("publish_date", "desc"));
  onSnapshot(q, (snapshot) => {
    let fTimestamp, jsDate, jsDateString, fmonth, fyear;

    snapshot.docs.forEach((doc) => {
      let blog = doc.data();

      fTimestamp = blog.publish_date;
      jsDate = fTimestamp.toDate();
      jsDateString = jsDate.toLocaleString('default', { dateStyle: 'long' });
      fmonth = jsDate.toLocaleString('default', { month: 'long' });
      fyear = jsDate.toLocaleString('default', { year: 'numeric' });  
      
      // console.log(fmonth, fyear);

      if(month === fmonth && fyear === fyear) {
        document.getElementById("blog").innerHTML +=
        `
          <div class="card mb-3 shadow-lg rounded-3">
            <div class="row g-0">
              <div class="col-md-4">
                <img src="${blog.cover_image}" class="card-image img-fluid rounded-start" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${blog.title}</h5>
                  ${blog.content_preview}
                  <a href="#" class="btn btn-primary mb-3">Read More</a>
                  <p class="card-text"><small class="text-muted">${jsDateString}</small></p>
                </div>
              </div>
            </div>
          </div>    
        `;

      }
      
      if(month == "all" && year == "all") {
        document.getElementById("blog").innerHTML +=
        `
          <div class="card mb-3 shadow-lg rounded-3">
            <div class="row g-0">
              <div class="col-md-4">
                <img src="${blog.cover_image}" class="card-image img-fluid rounded-start" alt="...">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${blog.title}</h5>
                  ${blog.content_preview}
                  <a href="#" class="btn btn-primary mb-3">Read More</a>
                  <p class="card-text"><small class="text-muted">${jsDateString}</small></p>
                </div>
              </div>
            </div>
          </div>    
        `;
      }
      
    });

  });

}

function displayStickyBlogFilter() {

  // GET BLOGS TIMESTAMP MONTH
  onSnapshot(blogRef, (snapshot) => {
    let blogMonths = [];
    let blogs = []
    let fTimestamp, jsDate, month, month_num, year, month_year;
    let containsMonthYear;

    snapshot.docs.forEach((doc) => {
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
    blogMonths.sort((a, b) => b.month_num - a.month_num);
    blogMonths.sort((a, b) => b.year - a.year);

    // SORT BLOG BY DATE - STARTS FROM THE LATEST BLOG
    blogs.sort((a, b) => b.publish_date - a.publish_date);
    // console.log(blogMonths);
    // console.log(blogs);

    blogMonths.forEach((blog) => {
      document.getElementById("blogMonth").innerHTML +=
        ` 
        <a class="list-group-item" data-month=${blog.month} data-year=${blog.year}>${blog.month_year}</a>    
      `
    });

    document.getElementById("blogMonth").innerHTML += 
    `
    <a class="list-group-item" data-month="all" data-year="all">All Blogs</a>   
    `

  });


}



// ADD EVENT LISTENER TO MONTHS CLICK EVENTS
document.getElementById("blogMonth").addEventListener("click", (e) => {
  e.preventDefault();

  document.getElementById("blog").innerHTML = "";

  let targetElement = e.target;
  let month = targetElement.dataset.month;
  let year = targetElement.dataset.year;

  // TODO: ACTIVE MONTH AND YEAR
  // targetElement.classList.add("active");

  // console.log(targetElement);
  // console.log(`month: ${month}, year: ${year}`);
  
  displayFilteredBlogs(month, year);

});