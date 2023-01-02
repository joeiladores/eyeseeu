function populateTestimonialPage() {
    fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogs')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((user) => {
                const cards = `
                <div class="card mt-3" style="max-width: 950px;">
                <div class="row g-0">
                  <div class="col-md-4">
                    <img src="${user.Thumbnail}" class="img-fluid rounded-start mt-3 ms-3 mb-3" alt="...">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body ms-3">
                      <h5 class="card-title">${user.Title}</h5>
                      <p class="card-text">${user.Content_Preview}</p>
                      <p class="card-text">${user.Publish_Date}</p>
                      <button type="button" class="btn btn-info">Read More</button>
                    </div>
                  </div>
                </div>
              </div>
        `;
                document.querySelector('#card-container').innerHTML += cards;
            });
        });
}

function GetData() {

  fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogs')
      .then( response =>
      {
          if ( response.status !== 200 )
          {
              console.log( 'Looks like there was a problem. Status Code: ' +
                  response.status );
              return;
          }

          console.log( response.headers.get( "Content-Type" ) );
          return response.json();
      }
      )
      .then( myJson =>
      {
          console.log( JSON.stringify( myJson ) );
      } )
      .catch( err =>
      {
          console.log( 'Fetch Error :-S', err );
      } );
}

window.onload = function () {
    populateTestimonialPage();
};


