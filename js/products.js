function filterAndRedirect(filter) {
  const currentUrl = window.location.href;
  const filteredProductUrl = `product.html?filter=${filter}`;
  window.location.href = filteredProductUrl;
}

