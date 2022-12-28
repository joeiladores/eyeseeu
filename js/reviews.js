function populateTestimonialPage() {
  // for (let x = 0; x < rating; x++) {
  //   let star += <i class="fa-solid fa-star"></i>;
  // }
  fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/testimonial')
    .then((response) => response.json())
    .then((data) => {
      data.forEach((user) => {
        // console.log(user.id);
        // for (let x = 0; x < user.id; x++) {
        // //   for (let y = 0; y < rating; y++) {
        // //     document.getElementById('star').innerHTML =
        // //       '<i class="fa-solid fa-star"></i>';
        // //   }
        // // }
        let ratings = Math.floor(user.rating);
        let stars = '';
        for (let i = 0; i < ratings; i++) {
          stars += '<i class="fa-solid fa-star"></i>';
        }
        const cards = `
        <div class="col-md-4 d-grid gy-4">
          <div class="card shadow border-0">
            <div class="card-body">
              <img class="profile-img" src="${user.image}" alt="">
              <h5 class="card-title">${user.name}</h5>
              <hr>
              <h6 class="card-text">"${user.text}"</h6>
              <p class="card-text">
              <div id="stars" class="text-muted">Ratings: <span style="color: #fef837">${stars}</span></div>
              </p>
            </div>
          </div>
        </div>
      `;
        document.querySelector('#card-container').innerHTML += cards;
      });
    });
}

window.onload = function () {
  populateTestimonialPage();
};
