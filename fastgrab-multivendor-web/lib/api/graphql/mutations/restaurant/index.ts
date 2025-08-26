import { gql } from "@apollo/client"

export const ADD_FAVOURITE_RESTAURANT = gql`mutation AddFavourite($id:String!){
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
  }`