function populateTestimonialPage() {
  
  fetch('https://63f38f25864fb1d6001935c2.mockapi.io/testimonial')
    .then((response) => response.json())
    .then((data) => {
      data.forEach((user) => {
        
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
              <div id="stars" class="text-muted">Ratings: <span style="color: #FFDF00">${stars}</span></div>
              </p>
            </div>
          </div>
        </div>`;
        document.querySelector('#card-container').innerHTML += cards;
      });
    });
}

window.onload = function () {
  populateTestimonialPage();
};
