const form = document.getElementById('blog-form');
form.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(form);
  const title = formData.get('title');
  const subtitle = formData.get('subtitle');
  const coverImage = formData.get('uploadCoverImage');
  const pubdate = formData.get('pubdate');
  const author = formData.get('author');
  const tags = formData.get('tags');
  const content = formData.get('content');

  // Send the form data to the server using an AJAX request or other method
});
