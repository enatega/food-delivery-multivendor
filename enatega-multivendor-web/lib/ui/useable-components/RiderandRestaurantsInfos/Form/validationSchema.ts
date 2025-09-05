import * as Yup from "yup";

const emailValidationSchema = (t: (key: string) => string) =>
  Yup.object({
    firstName: Yup.string().required(t("firstNameRequired")),
    lastName: Yup.string().required(t("lastNameRequired")),
    phoneNumber: Yup.string()
      .matches(/^\+?[0-9]{7,15}$/, t("phoneNumberInvalid"))
      .required(t("phoneNumberRequired")),
    email: Yup.string().email(t("emailInvalid")).required(t("emailRequired")),
    password: Yup.string()
      .min(6, t("passwordMin"))
      .required(t("passwordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("confirmPasswordMismatch"))
      .required(t("confirmPasswordRequired")),
    termsAccepted: Yup.boolean().oneOf([true], t("termsRequired")),
  });

export default emailValidationSchema;
