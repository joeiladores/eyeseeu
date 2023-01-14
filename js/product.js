function displayProduct() {
  fetch('https://63bec3bce348cb076217c92f.mockapi.io/products?p=1&l=10')
      .then((response) => response.json())
      .then((data) => {
          data.forEach((user) => {
              const cards = `
              <div class="col-2 card m-5 links" style="width: 17rem; height: 20.5em;" >
              <img src="${user.img}" alt="case" class="card-img-top img-fluid">
              <h6 class="text-center card-text">${user.name}</h3>
            </div>
      `;
              document.querySelector('#productDetails').innerHTML += cards;
          });
      });
}

window.onload = function () {
  displayProduct();
};
a