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
  
  fetch('https://63bec3bce348cb076217c92f.mockapi.io/products')
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("loader").style.display = "block";
        let productDetails = document.querySelector('#productDetails');
          productDetails.innerHTML = "";
          let randomData = [];
          while (data.length > 0) {
              let randomIndex = Math.floor(Math.random() * data.length);
              randomData.push(data[randomIndex]);
              data.splice(randomIndex, 1);
          }
          randomData.forEach((prod) => {
              const cards = `
              <div class="col-md-4 g-3">
        <a class="product-list" data-name="${product.name}">
          <figure class="card card-product-grid">
            <div class="img-wrap"> 
              <img src="${product.img}" class="img-fluid">
              <img src="${product.img1}" class="img-top img-fluid" alt="Card Front">
            </div>
            <figcaption class="info-wrap">
              <div class="fix-height">
                <h5 class="title">${product.name}</h5>
              </div>
            </figcaption>
          </figure>
          </a>
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
  products.sort(() => Math.random() - 0.5);
  let productList = document.getElementById("productDetails");
  productList.innerHTML = "";
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
      const productTemplate = 
        `<div class="col-md-4 g-3 text-center">
          <figure class="card card-product-grid" >
          <a class="nav-link" data-name="${product.name}">
            <div class="img-wrap"> 
              <img src="${product.img}" class="img-fluid">
              <img src="${product.img1}" class="img-top img-fluid">
            </div>
            <figcaption class="info-wrap">
              <div class="fix-height">
                <h5 class="title">${product.name}</h5>
              </div>
            </figcaption>
            </a>
          </figure>
        </div>`;
        productList.insertAdjacentHTML('beforeend',productTemplate);
  }
}
// end of filter
