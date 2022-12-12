window.onload = function () {
  populateServiceMain();
  popoulateServiceItems();
}

function populateServiceMain() {

  // POPULATE MAIN SERVICE SECTION
  fetch("https://638eb1de9cbdb0dbe31294ba.mockapi.io/services")
  .then(response => response.json())
  .then(services => {
    console.log(services);
       
    services.map(service => {

      console.log(service);
      document.querySelector(".page-title").innerHTML = 
      `
        <h1>${service.main_title}</h1>
      `;

      document.querySelector(".parallax").innerHTML =
      `
        <h1>${service.main_subtitle1}</h1>
        <h3>${service.main_subtitle2}</h3>
      `;

      document.querySelector(".parallax-content").innerHTML =
      `
      ${service.main_content}
      `; 

    });    

  });

}

// TODO: Populate the Service Menu




// POPULATE THE SERVICES CONTENTS
function popoulateServiceItems() {
  fetch("https://638eb1de9cbdb0dbe31294ba.mockapi.io/services-items")
  .then(response => response.json())
  .then(services => {
    services.map(serviceItems => {

      

    });    

  });
}


