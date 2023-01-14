
// product display
function displayProduct() {
  fetch('https://63bec3bce348cb076217c92f.mockapi.io/products')
      .then((response) => response.json())
      .then((data) => {
        let productDetails = document.querySelector('#productDetails');
          productDetails.innerHTML = "";
          let randomData = [];
          while (data.length > 0) {
              let randomIndex = Math.floor(Math.random() * data.length);
              randomData.push(data[randomIndex]);
              data.splice(randomIndex, 1);
          }
          randomData.forEach((user) => {
              const cards = `
              <div class="col-md-4 g-3 mt-5">
              <figure class="card card-product-grid">
                <div class="img-wrap"> 
                  <img src="${user.img}" class="img-fluid">
                </div>
                <figcaption class="info-wrap">
                  <div class="fix-height">
                    <h5 class="title text-center">${user.name}</h5>
                  </div>
                </figcaption>
              </figure>
            </div>
      `;
              document.querySelector('#productDetails').innerHTML += cards;
          });
      });
}
// end of product display

// filter
let links = document.querySelectorAll('.nav-link');

links.forEach(link => {
  link.addEventListener('click', function(event) {
    let productType = this.dataset.productType;
    fetch('https://63bec3bce348cb076217c92f.mockapi.io/products/')
      .then(response => response.json())
      .then(data => {
        let filteredProducts = data.filter(product => product.productType === productType);

        renderProducts(filteredProducts);
      });
  });
});

function renderProducts(products) {
  let productList = document.getElementById("productDetails");
  productList.innerHTML = "";
  let productFilter = document.getElementById("productDetails");
  productFilter.innerHTML = "";
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
      const productTemplate = 
        `<div class="col-md-4 g-3">
          <figure class="card card-product-grid">
            <div class="img-wrap"> 
              <img src="${product.img}" class="img-fluid">
            </div>
            <figcaption class="info-wrap">
              <div class="fix-height">
                <h5 class="title">${product.name}</h5>
              </div>
            </figcaption>
          </figure>
        </div>`;
        productList.insertAdjacentHTML('beforeend',productTemplate);
  }
}

// end of filter


window.onload = function () {
  displayProduct();
};
