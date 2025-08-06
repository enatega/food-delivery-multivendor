import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login(
    $type: String!
    $email: String
    $password: String
    $name: String
    $notificationToken: String
    $isActive: Boolean
  ) {
    login(
      type: $type
      email: $email
      password: $password
      name: $name
      notificationToken: $notificationToken
      isActive: $isActive
    ) {
      userId
      token
      tokenExpiration
      name
      phone
      phoneIsVerified
      email
      emailIsVerified
      picture
      addresses {
        location {
          coordinates
        }
        deliveryAddress
      }
      isNewUser
      userTypeId
      isActive
    }
  }
`;

export const EMAIL_EXISTS = gql`
  mutation EmailExist($email: String!) {
    emailExist(email: $email) {
      userType
      _id
    }
  }
`;

export const PHONE_EXISTS = gql`
  mutation PhoneExist($phone: String!) {
    phoneExist(phone: $phone) {
      _id
    }
  }
`;

export const SENT_OTP_TO_EMAIL = gql`
  mutation SendOtpToEmail($email: String!) {
    sendOtpToEmail(email: $email) {
      result
    }
  }
`;
export const SENT_OTP_TO_PHONE = gql`
  mutation SendOtpToPhoneNumber($phone: String!) {
    sendOtpToPhoneNumber(phone: $phone) {
      result
    }
  }
`;
export const RESET_PASSWORD = gql`
  mutation ResetPassword($password: String!, $email: String!) {
    resetPassword(password: $password, email: $email) {
      result
    }
  }
`;
export const CREATE_USER = gql`
  mutation CreateUser(
    $phone: String
    $email: String
    $password: String
    $name: String
    $notificationToken: String
    $appleId: String
  ) {
    createUser(
      userInput: {
        phone: $phone
        email: $email
        password: $password
        name: $name
        notificationToken: $notificationToken
        appleId: $appleId
      }
    ) {
      userId
      token
      tokenExpiration
      name
      phone
      phoneIsVerified
      email
      emailIsVerified
      picture
      isNewUser
      userTypeId
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $name: String!
    $phone: String
    $phoneIsVerified: Boolean
    $emailIsVerified: Boolean
  ) {
    updateUser(
      updateUserInput: {
        name: $name
        phone: $phone
        phoneIsVerified: $phoneIsVerified
        emailIsVerified: $emailIsVerified
      }
    ) {
      _id
      name
      phone
      phoneIsVerified
      emailIsVerified
    }
  }
`;

export const DEACTIVATE_USER = gql`
  mutation DeactivateUser($isActive: Boolean!, $email: String!) {
    Deactivate(isActive: $isActive, email: $email) {
      _id,
      name,
      email,
      isActive
    }
  }
`;

export const VERIFY_OTP = gql`
 mutation VerifyOtp($otp: String!, $email: String, $phone: String) {
    verifyOtp(otp: $otp, email: $email, phone: $phone) {
        result
    }
}
`