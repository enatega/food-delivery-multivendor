export const emailExist = `#graphql
  mutation EmailExist($email: String!) {
    emailExist(email: $email) {
      userType
      _id
      email
    }
  }`;

export const phoneExist = `#graphql
  mutation PhoneExist($phone: String!) {
    phoneExist(phone: $phone) {
      userType
      _id
      phone
    }
  }`;

export const sendOtpToEmail = `#graphql
  mutation SendOtpToEmail($email: String!, $otp: String!) {
    sendOtpToEmail(email: $email, otp: $otp) {
      result
    }
  }
  `;
export const sendOtpToPhoneNumber = `#graphql
  mutation SendOtpToPhoneNumber($phone: String!, $otp: String!) {
    sendOtpToPhoneNumber(phone: $phone, otp: $otp) {
      result
    }
  }
  `;
export const Deactivate = `#graphql
  mutation deactivated($isActive: Boolean!, $email: String!) {
    Deactivate(isActive: $isActive,email: $email) {
      isActive
    }
  }
  `;
export const login = `#graphql
  mutation Login($email:String,$password:String,$type:String!,$appleId:String,$name:String,$notificationToken:String){
    login(email:$email,password:$password,type:$type,appleId:$appleId,name:$name,notificationToken:$notificationToken){
     userId
     token
     tokenExpiration
     isActive
     name
     email
     phone
     isNewUser
   }
  }
  `;
export const forgotPassword = `#graphql
mutation ForgotPassword($email:String!,$otp:String!){
    forgotPassword(email:$email,otp:$otp){
      result
    }
  }`;
export const changePassword = `
 #graphql mutation ChangePassword($oldPassword:String!,$newPassword:String!){
    changePassword(oldPassword:$oldPassword,newPassword:$newPassword)
  }`;
export const resetPassword = `#graphql
mutation ResetPassword($password:String!,$email:String!){
    resetPassword(password:$password,email:$email){
      result
    }
  }`;
