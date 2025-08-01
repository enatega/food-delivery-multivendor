"use client";

// formik imports
import { Formik, Form, Field, ErrorMessage } from "formik";

// Components from primeReact
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

// libraries and utils
import { useRouter } from "next/navigation";
import { sendEmail } from "@/lib/utils/methods";
import "react-phone-input-2/lib/style.css";

// interfcaes
import { VendorFormValues } from "@/lib/utils/interfaces/Rider-restaurant.interface";

// component
import PhoneNumberInput from "./phoneNumberInput/PhoneNumberInput";

// validation Schema
import emailValidationSchema from "./validationSchema";

// hooks
import useToast from "@/lib/hooks/useToast";
import { useTranslations } from "next-intl";

interface formProps {
  heading: string;
  role: string;
}

const initialValues: VendorFormValues = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  password: "",
  confirmPassword: "",
  termsAccepted: false,
};

const EmailForm: React.FC<formProps> = ({ heading, role }) => {
  const { showToast } = useToast();
  const router = useRouter();
    const t = useTranslations()


  const handleSubmit = async (formData: VendorFormValues) => {
    const templateParams = {
      ...formData,
      role: role,
      isRider: false,
    };


    try {
      await sendEmail("template_eogfh2k", templateParams);

      showToast({
        type: "success",
        title: t("toast_success"),
        message: t("form_submitted_successfully"),
        duration: 4000,
      });

      router.push("/");
    } catch (error) {
      console.error("Failed to send email:", error);

      showToast({
        type: "error",
        title: t("toast_error"),
        message: t("failed_to_submit_form_please_try_again"),
        duration: 4000,
      });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-m my-6">
      <h2 className="text-[20px] font-semibold mb-6">{heading}</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={emailValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="grid gap-5">
            {/* First and Last Name */}
            <div className="gap-4 flex w-[100%] justify-between">
              <div className="w-[50%]">
                <Field name="firstName">
                  {({ field }: any) => (
                    <InputText
                      placeholder={t("first_name_label")}
                      {...field}
                      className="w-full text-sm border-2 border-gray-100 p-2 rounded-lg"
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="firstName"
                  component="small"
                  className="p-error text-sm"
                />
              </div>

              <div className="w-[50%]">
                <Field name="lastName">
                  {({ field }: any) => (
                    <InputText
                      placeholder={t('last_name_label')}
                      {...field}
                      className="w-full border-2 text-sm border-gray-100 p-2 rounded-lg"
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="lastName"
                  component="small"
                  className="p-error text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm">{t("email_label")}</label>
              <Field name= "email">
                {({ field }: any) => (
                  <InputText
                    placeholder={t("please_enter_your_email_address_label")}
                    {...field}
                    className="w-full border-2 text-sm border-gray-100 p-2 rounded-lg"
                  />
                )}
              </Field>
              <ErrorMessage
                name="email"
                component="small"
                className="p-error text-sm"
              />
            </div>

            {/* Phone Number */}
            <div>
              <PhoneNumberInput />
              <ErrorMessage
                name="phoneNumber"
                component="small"
                className="p-error text-sm  "
              />
            </div>

            {/* Password */}
            <div>
              <Field name="password">
                {({ field }: any) => (
                  <Password
                    {...field}
                    placeholder={t("password")}
                    toggleMask
                    className="w-full border-2 text-sm border-gray-100 p-2 rounded-lg"
                    feedback={false}
                  />
                )}
              </Field>
              <ErrorMessage
                name="password"
                component="small"
                className="p-error text-sm"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm">{t("confirm_password_label")}</label>
              <Field name="confirmPassword">
                {({ field }: any) => (
                  <Password
                    placeholder={t("confirm_password_label")}
                    {...field}
                    toggleMask
                    className="w-full border-2 text-sm border-gray-100 p-2 rounded-lg"
                    feedback={false}
                  />
                )}
              </Field>
              <ErrorMessage
                name="confirmPassword"
                component="small"
                className="p-error text-sm"
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-center gap-2 h-[40px]">
              <Checkbox
                inputId="termsAccepted"
                checked={values.termsAccepted}
                onChange={(e) => setFieldValue("termsAccepted", e.checked)}
                className="border-gray-400 text-sm"
              />
              <label className="text-sm" htmlFor="termsAccepted">
                {t("i_accept_the_terms_and_conditions")}
              </label>
            </div>
            <ErrorMessage
              name="termsAccepted"
              component="small"
              className="p-error text-sm"
            />

            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <Button
                type="submit"
                label={t("send_button")}
                loading={isSubmitting}
                className="mt-4 bg-[#5AC12F] text-[16px] font-medium w-[200px] p-2 rounded-full text-white  hover:bg-[#5AC12F] transition-all"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EmailForm;
