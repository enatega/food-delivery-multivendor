export const relatedItems = `#graphql
query RelatedItems($itemId: String!, $restaurantId: String!) {
  relatedItems(itemId: $itemId, restaurantId: $restaurantId)
}`;

export const food = `#graphql
fragment FoodItem on Food{
  _id
  title
  image
  description
  subCategory
  variations{
    _id
    title
    price
    discounted
    addons

  }
}
`;
export const popularItems = `#graphql
query PopularItems($restaurantId: String!) {
  popularItems(restaurantId: $restaurantId) {
    id
    count
  }
}
`;
