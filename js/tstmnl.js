window.onload = function () {
  populateTestimonialPage();
}

function populateTestimonialPage() {
fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/testimonial')
  .then(response => response.json())
  .then(data => {
    data.forEach(user => {
      const cards = `
      <div class="col-md-4">
        <div class="card shadow border-0">
          <div class="card-body">
            <h5 class="card-title">${user.name}</h5>
            <hr>
            <h6 class="card-text">${user.text}</h6>
            <p class="card-text text-muted">Rated ${user.rating} stars</p>
          </div>
        </div>
      </div>
      
      `
      document.querySelector("#card-container").innerHTML += cards
    });
  })}