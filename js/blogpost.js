window.onload = function () {
  displayBlogPost();


}

window.onresize = function() {
  displayBlogs();
}

function displayBlogPost() {
  const urlSearchStr = new URLSearchParams(window.location.search);
  let blogID = urlSearchStr.get("blog");
  // check if blog id is defined
  if(blogID) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let month, year, day, jsDate;
    // GET SPECIFIC BLOG BY BLOG_ID
    fetch(`https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogsnew/${blogID}`)
      .then((response) => response.json())
      .then((blog) => {
        jsDate = new Date(blog.Publish_Date);
        month = monthNames[jsDate.getMonth()];
        day = jsDate.getDate();
        year = jsDate.getFullYear();
        document.getElementById("blog-title").innerHTML =
          `
            <h1 class="mx-3">${blog.Title}</h1>
            <h3 class="mx-5">${blog.Author}</h3>
            <h5 class="mx-5"><small>${month} ${day}, ${year}</small></h5>
          `;
        document.getElementById("blog-cover-image").innerHTML =
          `
            <img src="${blog.Cover_Image}" class="blog-image img-fluid rounded-start" alt="..." style="display: block; margin-left: auto; margin-right: auto;">
          `;
        document.getElementById("blog-content").innerHTML =
          `
            <div class="mx-5">${blog.Content}</div>
          `;
      })
      .catch((err) => {
        console.log("Error is: " + err);
        window.location.href = "blog.html";
      });
  } else {
    window.location.href = "blog.html";
  }
}

const API_URL = 'https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogsnew?sortBy=Publish_Date&order=desc';

async function getBlogs() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function displayBlogs() {
  
  const blogs = await getBlogs();
  const carouselInner = document.querySelector('.carousel-inner');
  const carouselIndicators = document.querySelector('.carousel-indicators');
  let counter = 0;
  let cardsPerSlide = 3;

  if (window.matchMedia("(max-width: 1215px)").matches) {
    cardsPerSlide = 2;
  }
  if (window.matchMedia("(max-width: 920px)").matches) {
    cardsPerSlide = 1;
  }
  

  for (let i = 0; i < blogs.length; i += cardsPerSlide) {
    if (counter >= 15) {
      return;
    }
    counter++;

    const div = document.createElement('div');
    div.classList.add('carousel-item');

    if (counter === 1) {
      div.classList.add('active');
    }

    let cardsHTML = "";

    for (let j = i; j < i + cardsPerSlide; j++) {
      if (j >= blogs.length) {
        break;
      }
      cardsHTML += `
        <div class="col-4">
          <div class="card border border-light" style="width: 18rem;">
            <div class="card-body">
              <img src="${blogs[j].Thumbnail}" class="card-img-top" alt="...">
              <h5 class="card-title">${blogs[j].Title}</h5>
              <a href="blogpost.html?blog=${blogs[j].id}" class="btn btn-info">Read More</a>
            </div>
          </div>
        </div>
      `;
    }

    div.innerHTML = `
      <div class="row d-flex justify-content-evenly">
        ${cardsHTML}
      </div>
    `;

    carouselInner.appendChild(div);

    const indicator = document.createElement('li');
    indicator.setAttribute('data-bs-target', '#carouselExampleDark');
    indicator.setAttribute('data-bs-slide-to', counter - 1);

    if (counter === 1) {
      indicator.classList.add('active');
    }
    carouselIndicators.appendChild(indicator);
}
}

// check the screen size on page load and on resizing
const mediaQuery = window.matchMedia("(max-width: 768px)");
displayBlogs(mediaQuery);
mediaQuery.addEventListener(displayBlogs);


displayBlogs();



