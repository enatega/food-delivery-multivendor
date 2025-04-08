export const getBanners = `#graphql
query Banners{
  banners {
    _id
    title
    description
    action
    screen
    file
    parameters
  }
}`;
