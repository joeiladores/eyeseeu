window.onload = function () {
  displayBlogs();
  displayStickyBlogFilter()
 
}


let startPageIndex = 0, pageLimit = 5, currentPageEnd = pageLimit, pageEnd;

function displayBlogs() {

  // GET BLOGS
  fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogsnew?sortBy=Publish_Date&order=desc')
    .then((response) => response.json())
    .then((blogs) => {

      // console.log(blogs);
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      let month, year, day, jsDate;

      // DISPLAY 5 BLOGS
      pageEnd = blogs.length;
      blogs.slice(startPageIndex, currentPageEnd).map((blog) => {

        jsDate = new Date(blog.Publish_Date);
        month = monthNames[jsDate.getMonth()];
        day = jsDate.getDate();
        year = jsDate.getFullYear();
        // console.log(month, day, year);

        let description = blog.Content_Preview;
        if (description.length > 300) {
          description = description.substring(0, 300) + "...";
        }

        document.getElementById("blog").innerHTML +=
          `
            <div class="card mb-3 shadow-lg rounded-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <a href="blogpost.html?blog=${blog.id}" target="_blank">
                    <img src="${blog.Cover_Image}" class="card-image img-fluid rounded-start" alt="...">
                  </a>
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title mb-3">${blog.Title}</h5>
                    ${description}                                  
                    <p class="card-text mt-3"><small class="text-muted">${month} ${day}, ${year}</small></p>
                    <div class="mt-3"><a href="blogpost.html?blog=${blog.id}" target="_blank"class="btn btn-primary mb-3">Read More</a></div>  
                  </div>
                </div>
              </div>
            </div>    
          `;

        // TODO: VIEW MORE BLOGS BUTTON
        document.getElementById("morePageBtn").style.display = "block";

      });

    })
    .catch((err) => {
      console.log("Error is: " + err);
    });
}

function displayFilteredBlogs(m, y) {

  // console.log("Filtered blogs...");
  // console.log(`m: ${m}, y: ${y}`);
  // console.log("typeof m: " + typeof m, " typeof y: " + typeof y);

  // GET BLOGS
  fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogsnew?sortBy=Publish_Date&order=desc')
    .then((response) => response.json())
    .then((blogs) => {

      // DISPLAY 5 BLOGS
      blogs.map((blog) => {

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month, year, day, d;
        d = new Date(blog.Publish_Date);
        month = monthNames[d.getMonth()];
        day = d.getDate();
        year = d.getFullYear().toString();

        // console.log(typeof month);
        // console.log(typeof day);
        // console.log(typeof year);

        if (m === month && y === year) {

          // console.log("Inside if....");
          // console.log(`month: ${month}, day: ${day}, year: ${year}`);

          document.getElementById("blog").innerHTML +=
            `
            <div class="card mb-3 shadow-lg rounded-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <a href="blogpost.html?blog=${blog.id}">
                    <img src="${blog.Cover_Image}" class="card-image img-fluid rounded-start" alt="...">
                  </a>
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title mb-3">${blog.Title}</h5>
                    ${blog.Content_Preview}                                  
                    <p class="card-text mt-3"><small class="text-muted">${month} ${day}, ${year}</small></p>
                    <div class="mt-3"><a href="blogpost.html?blog=${blog.id}" class="btn btn-primary mb-3">Read More</a></div>  
                  </div>
                </div>
              </div>
            </div>    
          `;
        }
        if (m === "all" && y === "all") {
          document.getElementById("blog").innerHTML +=
            `
            <div class="card mb-3 shadow-lg rounded-3">
              <div class="row g-0">
                <div class="col-md-4">
                  <a href="blogpost.html?blog=${blog.id}">
                    <img src="${blog.Cover_Image}" class="card-image img-fluid rounded-start" alt="...">
                  </a>
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title mb-3">${blog.Title}</h5>
                    ${blog.Content_Preview}                                  
                    <p class="card-text mt-3"><small class="text-muted">${month} ${day}, ${year}</small></p>
                    <div class="mt-3"><a href="blogpost.html?blog=${blog.id}" class="btn btn-primary mb-3">Read More</a></div>  
                  </div>
                </div>
              </div>
            </div>    
          `;
        }

      });

    })
    .catch((err) => {
      console.log("Error is: " + err);
    });
}

function displayStickyBlogFilter() {
  // GET BLOGS DATES
  fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogsnew')
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

        let containsMonthYear = (blogMonths, month_year) => {
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

      // DISPLAY MONTHS & YEAR IN THE STICKY RIGHT PANEL
      document.getElementById("blogMonth").innerHTML +=
        `
        <a class="list-group-item active" data-month="home" data-year="home">Home</a>   
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

      // Add event listener to "Home" button
      const homeButton = document.querySelector("[data-month='home']");
      homeButton.addEventListener("click", () => {
        window.scrollTo(0, 0);
      });
    })
    .catch((err) => {
      console.log("Error is: " + err);
    });

    
}

// ADD EVENT LISTENER TO MONTHS CLICK EVENTS
document.getElementById("blogMonth").addEventListener("click", (e) => {
  e.preventDefault();

  
  let targetElement = e.target;
  let month = targetElement.dataset.month;
  let year = targetElement.dataset.year;

  let monthList = document.querySelectorAll(".list-group-item");
  monthList.forEach(function (item) {
    item.classList.remove("active");
  
  });
  targetElement.classList.add("active");

  // TODO: ACTIVE MONTH AND YEAR
  // targetElement.classList.add("active");

  // console.log(targetElement);
  // console.log(`month: ${month}, year: ${year}`);
  // console.log("Event listerner...");
  // console.log("typeof month: " + typeof month, ", typeof year: " + typeof year);

  if (month === "home" && year === "home") {
    document.getElementById("blog").innerHTML = "";
    startPageIndex = 0, currentPageEnd = pageLimit;
    displayBlogs();
    document.getElementById("morePageBtn").textContent = "View more blogs";
    document.getElementById("morePageBtn").classList.remove("disabled");
  }
  else {
    document.getElementById("blog").innerHTML = "";
    document.getElementById("morePageBtn").style.display = "none";
    displayFilteredBlogs(month, year);
  }

});

// ADD EVENT LISTERNER TO THE VIEW MORE BUTTON
document.getElementById("morePageBtn").addEventListener("click", (e) => {
  e.preventDefault();

  startPageIndex += pageLimit;
  currentPageEnd += pageLimit;

  // console.log(`Page Start Index: ${startPageIndex}`);
  // console.log(`Page Current End: ${currentPageEnd}`);
  // console.log(`Page End: ${pageEnd}`);

  if ((pageEnd - currentPageEnd) >= pageLimit) {
    displayBlogs();
  }
  else {
    displayBlogs();
    document.getElementById("morePageBtn").textContent = "End of blog";
    document.getElementById("morePageBtn").classList.add("disabled");
  }

});


