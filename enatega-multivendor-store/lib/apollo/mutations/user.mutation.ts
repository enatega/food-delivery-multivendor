export const createUser = `#graphql
    mutation CreateUser($phone:String,$email:String,$password:String,$name:String,$notificationToken:String,$appleId:String){
        createUser(userInput:{
            phone:$phone,
            email:$email,
            password:$password,
            name:$name,
            notificationToken:$notificationToken,
            appleId:$appleId
        }){
            userId
            token
            tokenExpiration
            name
            email
            phone
        }
      }`;

export const updateUser = `#graphql
      mutation UpdateUser($name:String!,$phone:String,$phoneIsVerified:Boolean,$emailIsVerified:Boolean){
          updateUser(updateUserInput:{name:$name,phone:$phone,phoneIsVerified:$phoneIsVerified,emailIsVerified:$emailIsVerified}){
            _id
            name
            phone
            phoneIsVerified
            emailIsVerified
          }
        }`;
