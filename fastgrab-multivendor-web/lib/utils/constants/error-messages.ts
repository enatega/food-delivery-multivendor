import {
  ISignInFormErrors,
  ISignUpFormErrors,
  INoticiationErrors,
} from "@/lib/utils/interfaces";

export const PasswordErrors = [
  "At least 6 characters",
  "At least one lowercase letter (a-z)",
  "At least one uppercase letter (A-Z)",
  "At least one number (0-9)",
  "At least one special character",
  "Password does not match",
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
