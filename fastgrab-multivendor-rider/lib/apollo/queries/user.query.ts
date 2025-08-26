export const users = `#graphql
query Users {
  users {
    _id
   email
 }
}`;

export const profile = `#graphql
        query{
          profile{
            _id
            name
            phone
            phoneIsVerified
            email
            emailIsVerified
            notificationToken
            isActive
            isOrderNotification
            isOfferNotification
            addresses{
              _id
              label
              deliveryAddress
              details
              location{coordinates}
              selected
            }
            favourite
          }
        }`;
