window.onload = function () {
  populateServicePage();
}

function populateServicePage() {

  // POPULATE MAIN SERVICE SECTION
  fetch("https://638eb1de9cbdb0dbe31294ba.mockapi.io/services")
  .then(response => response.json())
  .then(services => {
    console.log(services);
       
    services.map(service => {

      console.log(service);
      document.querySelector("#parallax-section").innerHTML = 
      `
        <section>
          <div class="page-title">
            <h1>${service.main_title}</h1>
          </div>
        </section>    

        <section>
          <div class="parallax">
            <h1>${service.main_subtitle1}</h1>
            <h3>${service.main_subtitle2}</h3>
          </div>
        </section>    

        <section>
          <div class="parallax-content">${service.main_content}</div>
        </section> 
      `;
    });    

  });

  // POPULATE THE SERVICES CONTENTS
  // function popoulateServiceItems() {
  //   fetch("https://638eb1de9cbdb0dbe31294ba.mockapi.io/services-items")
  //   .then(response => response.json())
  //   .then(services => {
  //     services.map(serviceItems => {
  //       console.log(serviceItems);

  //       document.querySelector(".container").innerHTML +=
  //       `
  //         <div class="content-items pb-5" id="compre-eye-exam">
  //           <h2>${serviceItems.name}</h2>
  //           <img class="content-images img-fluid pt-3 pb-3" src="${serviceItems.image}" alt="">
  //           ${serviceItems.content}
  //         </div>
        
  //       `;
  //     });    

  //   });

  
  }



// TODO: Populate the Service Menu







