// product main page 
const url = new URL(window.location.href);
const filter = url.searchParams.get("filter");
document.getElementById("loader").style.display = "block";
fetch('https://63bec3bce348cb076217c92f.mockapi.io/products')
    .then((response) => response.json())
    .then((data) => {
        const filteredProducts = data.filter(product => product.productType === filter);
        renderProducts(filteredProducts);
        document.getElementById("loader").style.display = "none";
    });
// end product main page


// product display

function displayProduct() {
  document.getElementById("loader").style.display = "block";
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
          document.getElementById("loader").style.display = "none";
          window.onload = function () {
            displayProduct();
          };
      });
}
// end of product display


// filter
let links = document.querySelectorAll('.nav-link');

links.forEach(link => {
  link.addEventListener('click', function(event) {
    let productType = this.dataset.productType;
    document.getElementById("loader").style.display = "block";
    fetch('https://63bec3bce348cb076217c92f.mockapi.io/products')
      .then(response => response.json())
      .then(data => {
        let filteredProducts = data.filter(product => product.productType === productType);
        
        renderProducts(filteredProducts);
      });
      document.getElementById("loader").style.display = "none";
  });
});


function renderProducts(products) {
  
  let productList = document.getElementById("productDetails");
  productList.innerHTML = "";
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

