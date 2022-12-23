function populateTestimonialPage() {
    fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogs')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((user) => {
                const cards = `
          <div class="card col-8 mt-5 border-transaparent">
        <img src="${user.thumbnail}" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${user.title}</h5>
        <p class="card-text">${user.preview_content}</p>
        <p class="card-text">${user.publish_date}</p>
        <button type="button" class="btn btn-info">Read More</button>
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


