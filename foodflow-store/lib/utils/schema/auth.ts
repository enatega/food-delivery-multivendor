import * as Yup from "yup";

export const SignInSchema = Yup.object().shape({
  username: Yup.string().required("Username is Required"),
  password: Yup.string().required("Password cannot be empty"),
});
