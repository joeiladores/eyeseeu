function blogpost() {
    fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogs')
        .then((response) => response.json())
        .then((data) => {
            data.forEach((user) => {
                const cards = `
                <div class="mt-3">
                  <div class="col-md-4">
                    <img src="${user.Thumbnail}" class="img-fluid rounded-start mt-3 ms-3 mb-3" alt="...">
                  </div>
                  <div class="col-md-8">
                    <div class="ms-3">
                    <p class="">${user.Author}</p>
                    <p class="">${user.Publish_Date}</p>
                    <h5 class="">${user.Title}</h5>
                      <p class="">${user.Content}</p>                      
                  </div>
                </div>
              </div>
        `;
                document.querySelector('#card-container').innerHTML += cards;
            });
        });
}

function GetData() {

  fetch('https://638eb1de9cbdb0dbe31294ba.mockapi.io/blogs/:id')
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
    blogpost();
};


