function populateTestimonialPage() {
    fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogsthumbnail')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((user) => {
                const cards = `
          <div class="card col-8 mt-5 border-transaparent">
        <img src="${user.image}" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${user.name}</h5>
        <p class="card-text">${user.text}</p>
        <p class="card-text">${user.read}</p>
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


