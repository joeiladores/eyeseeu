window.onload = function () {
  displayBlogs();
  displayStickyBlogFilter()
}

function displayBlogs() {

  let pageSet = 1, pageLimit = 5;

  // GET BLOGS
  fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogsnew?sortBy=Publish_Date&order=desc')
    .then((response) => response.json())
    .then((blogs) => {      

      // console.log(blogs);
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let month, year, day, d;
                
      // DISPLAY 5 BLOGS
      blogs.slice(0, pageLimit).map((blog) => {

        d = new Date(blog.Publish_Date);
        month = monthNames[d.getMonth()];
        day = d.getDate();
        year = d.getFullYear();
        // console.log(month, day, year);

        document.getElementById("blog").innerHTML +=
          `
            <div class="card mb-3 shadow-lg rounded-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <a href="blogpost.html?blog=${blog.Id}">
                    <img src="${blog.Cover_Image}" class="card-image img-fluid rounded-start" alt="...">
                  </a>
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title mb-3">${blog.Title}</h5>
                    ${blog.Content_Preview}                                  
                    <p class="card-text mt-3"><small class="text-muted">${month} ${day}, ${year}</small></p>
                    <div class="mt-3"><a href="blogpost.html?blog=${blog.Id}" class="btn btn-primary mb-3">Read More</a></div>  
                  </div>
                </div>
              </div>
            </div>    
          `;

        // TODO: VIEW MORE BLOGS BUTTON

      });

    })
    .catch((err) => {
      console.log("Error is: " + err);
    });
}

function displayFilteredBlogs(m, y) {

  // GET BLOGS
  fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogsnew?sortBy=Publish_Date&order=desc')
    .then((response) => response.json())
    .then((blogs) => {      

      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let month, year, day, d;
                
      // DISPLAY 5 BLOGS
      blogs.map((blog) => {

        d = new Date(blog.Publish_Date);
        month = monthNames[d.getMonth()];
        day = d.getDate();
        year = d.getFullYear();

        if(m === month && y === year) {
          document.getElementById("blog").innerHTML +=
          `
            <div class="card mb-3 shadow-lg rounded-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <a href="blogpost.html?blog=${blog.Id}">
                    <img src="${blog.Cover_Image}" class="card-image img-fluid rounded-start" alt="...">
                  </a>
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title mb-3">${blog.Title}</h5>
                    ${blog.Content_Preview}                                  
                    <p class="card-text mt-3"><small class="text-muted">${month} ${day}, ${year}</small></p>
                    <div class="mt-3"><a href="blogpost.html?blog=${blog.Id}" class="btn btn-primary mb-3">Read More</a></div>  
                  </div>
                </div>
              </div>
            </div>    
          `;
        }
        else if(m == "all" && y == "all") {
          document.getElementById("blog").innerHTML +=
          `
            <div class="card mb-3 shadow-lg rounded-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <a href="blogpost.html?blog=${blog.Id}">
                    <img src="${blog.Cover_Image}" class="card-image img-fluid rounded-start" alt="...">
                  </a>
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title mb-3">${blog.Title}</h5>
                    ${blog.Content_Preview}                                  
                    <p class="card-text mt-3"><small class="text-muted">${month} ${day}, ${year}</small></p>
                    <div class="mt-3"><a href="blogpost.html?blog=${blog.Id}" class="btn btn-primary mb-3">Read More</a></div>  
                  </div>
                </div>
              </div>
            </div>    
          `;
        }
        else {
          displayBlogs();
        }

        // TODO: VIEW MORE BLOGS BUTTON

      });

    })
    .catch((err) => {
      console.log("Error is: " + err);
    });
}

function displayStickyBlogFilter() {

  // GET BLOGS DATES
  fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogs')
    .then((response) => response.json())
    .then((data) => {

      // const blogs = [];
      let blogMonths = [];
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let month, month_num, year, month_year;

      data.forEach((blog) => {

        const d = new Date(blog.Publish_Date);
        month_num = d.getMonth();
        month = monthNames[d.getMonth()];
        year = d.getFullYear();
        month_year = month + " " + year;

        // console.log(`month_year: ${month_year}`);

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

      // console.log(blogMonths);

      // SORT BLOG BY DATE - STARTS FROM THE LATEST BLOG
      // blogs.sort((a, b) => b.Publish_Date - a.Publish_Date);
      // console.log(blogs);
      // blogs.forEach((blog) => {
      //   console.log(blog.Publish_Date);
      // });

      // DISPLAY MONTHS & YEAR IN THE STICKY RIGHT PANEL
      document.getElementById("blogMonth").innerHTML +=
        `
      <a class="list-group-item" data-month="home" data-year="home">Home</a>   
      `

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

    })
    .catch((err) => {
      console.log("Error is: " + err);
    });

}

// ADD EVENT LISTENER TO MONTHS CLICK EVENTS
// document.getElementById("blogMonth").addEventListener("click", (e) => {
//   e.preventDefault();

//   let targetElement = e.target;
//   let month = targetElement.dataset.month;
//   let year = targetElement.dataset.year;

//   // TODO: ACTIVE MONTH AND YEAR
//   // targetElement.classList.add("active");

//   console.log(targetElement);
//   console.log(`month: ${month}, year: ${year}`);

//   document.getElementById("blog").innerHTML = "";
//   displayFilteredBlogs(month, year);

// });