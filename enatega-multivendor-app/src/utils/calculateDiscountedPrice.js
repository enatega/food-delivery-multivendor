export const calculateDiscountedPrice = (price = 0, discounted = 0) => {
  return Number(discounted) > 0 ? Number(price) + Number(discounted) : Number(price);
}
