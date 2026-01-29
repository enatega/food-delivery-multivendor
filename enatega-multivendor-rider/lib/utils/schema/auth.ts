import * as Yup from "yup";

export const SignInSchema = Yup.object().shape({
  username: Yup.string().required("Email is Required"),
  password: Yup.string().required("Password cannot be empty"),
});

export const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phone: Yup.string()
    .min(10, "Phone number is too short")
    .required("Phone number is required"),
  vehicleType: Yup.string().required("Vehicle type is required"),
  zone: Yup.string().required("Zone is required"),
  referralCode: Yup.string()
    .min(3, "Referral code must be at least 3 characters")
    .optional(),
});
