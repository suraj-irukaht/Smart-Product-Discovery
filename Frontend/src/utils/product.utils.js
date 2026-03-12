export const getProductImage = (product) => {
  return (
    product.mainImage ||
    product.main_image ||
    product.image_url?.[0] ||
    "/placeholder-product.png"
  );
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
