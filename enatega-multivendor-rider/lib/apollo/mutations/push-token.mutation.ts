export const pushToken = `#graphql
mutation PushToken($token:String){
    pushToken(token:$token){
      _id
      notificationToken
    }
  }`;
