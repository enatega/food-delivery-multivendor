export const deleteAddress = `#graphql
mutation DeleteAddress($id:ID!){
    deleteAddress(id:$id){
      _id
      addresses{
        _id
        label
        deliveryAddress
        details
        location{coordinates}
      }
    }
  }`;

export const deleteBulkAddresses = `#graphql
mutation DeleteBulkAddresses($ids:[ID!]!){
  deleteBulkAddresses(ids:$ids){
      _id
      addresses{
        _id
        label
        deliveryAddress
        details
        location{coordinates}
      }
    }
  }`;

export const createAddress = `#graphql
mutation CreateAddress($addressInput:AddressInput!){
    createAddress(addressInput:$addressInput){
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

export const editAddress = `#graphql
mutation EditAddress($addressInput:AddressInput!){
    editAddress(addressInput:$addressInput){
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

export const selectAddress = `#graphql
mutation SelectAddress($id:String!){
    selectAddress(id:$id){
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
