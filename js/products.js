function filterAndRedirect(productType) {
  const currentUrl = window.location.href;
  const filteredProductUrl = `product.html?filter=${productType}`;
  window.location.href = filteredProductUrl;
}

