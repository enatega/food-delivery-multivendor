import * as Yup from "yup";

const emailValidationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phoneNumber: Yup.string()
      .matches(/^\+?[0-9]{7,15}$/, "Enter a valid phone number")
      .required("Phone number is required"),
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
    termsAccepted: Yup.boolean().oneOf([true], "Accept terms to continue"),
  });

  export default emailValidationSchema;