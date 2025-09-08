import {
  ISignInFormErrors,
  ISignUpFormErrors,
  INoticiationErrors,
} from "@/lib/utils/interfaces";


// translation


export const PasswordErrors = [
  "At_least_6_characters_label",
  "At_least_one_lowercase_letter_(a-z)_label",
  "At_least_one_uppercase_letter_(A-Z)_label",
  "At_least_one_number_(0-9)_label",
  "At_least_one_special_character",
  "Password_does_not_match",
];

export const SignUpErrors: ISignUpFormErrors = {
  firstName: ["Required", "Name cannot be only spaces"],
  lastName: ["Required", "Name cannot be only spaces"],
  email: ["Required", "Invalid email"],
  password: ["Required", ...PasswordErrors],
  confirmPassword: ["Required", "Password must match"],
};

export const SignInErrors: ISignInFormErrors = {
  email: ["Required", "Invalid email"],
  password: ["Required"],
};

export const NotificationErrors: INoticiationErrors = {
  title: ["Required"],
  body: ["Required"],
};
