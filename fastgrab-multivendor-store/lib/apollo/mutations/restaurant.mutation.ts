export const addFavouriteRestaurant = `#graphql
mutation AddFavourite($id:String!){
    addFavourite(id:$id){
      _id
      addresses{
        _id
        label
        deliveryAddress
        details
        location{coordinates}
        selected
      }
    }
  }`;
