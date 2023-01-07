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





