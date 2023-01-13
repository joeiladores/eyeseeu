window.onload = function () {
  displayBlogPost();

}

function displayBlogPost() {

  const urlSearchStr = new URLSearchParams(window.location.search);
  let blogID = urlSearchStr.get("blog");
  // console.log(blogID);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let month, year, day, jsDate;

  // GET SPECIFIC BLOG BY BLOG_ID
  fetch(`https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogsnew/${blogID}`)
    .then((response) => response.json())
    .then((blog) => {

      // console.log(blog.Title);
      jsDate = new Date(blog.Publish_Date);
      month = monthNames[jsDate.getMonth()];
      day = jsDate.getDate();
      year = jsDate.getFullYear();

      document.getElementById("blog-title").innerHTML =
        `
          <h1>${blog.Title}</h1>
          <h3>${blog.Author}</h3>
          <h5><small>${month} ${day}, ${year}</small></h5>
        `

      document.getElementById("blog-cover-image").innerHTML =
        `
      
          <img src="${blog.Cover_Image}" class="blog-image img-fluid rounded-start" alt="..." style="display: block; margin-left: auto; margin-right: auto;">
          
        `

      document.getElementById("blog-content").innerHTML =
        `
          <div>${blog.Content}</div>
        
        `
  
      

    })
    .catch((err) => {
      console.log("Error is: " + err);
    });
}


const API_URL = 'https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogsnew';

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

  blogs.forEach((blog, index) => {
    if (counter >= 3) {
      return;
    }
    counter++;

    const div = document.createElement('div');
    div.classList.add('carousel-item');

    if (index === 0) {
      div.classList.add('active');
    }

    div.innerHTML = `
    <div class="row d-flex justify-content-evenly">
      <div class="col-4">
        <div class="card border border-info" style="width: 18rem;">
          <div class="card-body">
          <img src="${blogs[index].Cover_Image}" class="card-img-top" alt="...">
            <h5 class="card-title">${blogs[index].Title}</h5>
            <p class="card-text"></p>
            <a href="blogpost.html?blog=${blogs[index].id}" class="btn btn-info">Read More</a>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card border border-info " style="width: 18rem;">
          <div class="card-body">
          <img src="${blogs[index + 3].Cover_Image}" class="card-img-top" alt="...">
            <h5 class="card-title">${blogs[index + 3].Title}</h5>
            <p class="card-text"></p>
            <a href="blogpost.html?blog=${blogs[index + 3].id}" class="btn btn-info">Read More</a>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card border border-info" style="width: 18rem;">
          <div class="card-body">
          <img src="${blogs[index + 6].Cover_Image}" class="card-img-top" alt="...">
            <h5 class="card-title">${blogs[index + 6].Title}</h5>
            <p class="card-text"></p>
            <a href="blogpost.html?blog=${blogs[index + 6].id}" class="btn btn-info">Read More</a>
          </div>
        </div>
      </div>
    </div>
    </div>
  `;
    carouselInner.appendChild(div);

    const indicator = document.createElement('li');
    indicator.setAttribute('data-bs-target', '#carouselExampleDark');
    indicator.setAttribute('data-bs-slide-to', index);

    if (index === 0) {
      indicator.classList.add('active');
    }
    carouselIndicators.appendChild(indicator);
  });
}

displayBlogs();




