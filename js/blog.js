// function populateServicePage() {

//     // POPULATE MAIN SERVICE SECTION
//     fetch("https://638eb1de9cbdb0dbe31294ba.mockapi.io/services")
//     .then(response => response.json())
//     .then(services => {
//       console.log(services);
         
//       services.map(service => {
  
//         console.log(service);
//         document.querySelector("#card-content").innerHTML = 
//         `
//           <section>
//             <div class="page-title">
//               <h1>${service.main_title}</h1>
//             </div>
//           </section>    
  
//           <section>
//             <div class="parallax">
//               <h1>${service.main_subtitle1}</h1>
//               <h3>${service.main_subtitle2}</h3>
//             </div>
//           </section>    
  
//           <section>
//             <div class="parallax-content">${service.main_content}</div>
//           </section> 
//         `;
//       });    
  
//     });

  
    
//     }
  