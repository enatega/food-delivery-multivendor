export interface ISignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ISignUpFormErrors {
  firstName: string[];
  lastName: string[];
  email: string[];
  password: string[];
  confirmPassword: string[];
}
