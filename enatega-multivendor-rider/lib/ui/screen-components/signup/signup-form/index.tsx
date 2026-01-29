import { CustomContinueButton } from "@/lib/ui/useable-components";
import { ISignUpInitialValues } from "@/lib/utils/interfaces/auth.interface";
import { SignUpSchema } from "@/lib/utils/schema";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import FormInput from "../form-input";
import CustomPhoneInput from "../custom-phone-input";
import VehicleSelector from "../vehicle-selector";
import ZoneSelector from "../zone-selector";

interface Zone {
  _id: string;
  title: string;
  description: string;
}

interface SignUpFormProps {
  onSubmit: (values: ISignUpInitialValues) => void;
  zones: Zone[];
  zonesLoading: boolean;
  isSubmitting: boolean;
}

const initialValues: ISignUpInitialValues = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  vehicleType: "",
  zone: "",
  referralCode: "",
};

export default function SignUpForm({
  onSubmit,
  zones,
  zonesLoading,
  isSubmitting,
}: SignUpFormProps) {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SignUpSchema}
      onSubmit={onSubmit}
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={false}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
      }) => (
        <View className="gap-y-1">
          <FormInput
            label={t("Full Name")}
            placeholder={t("Enter your full name")}
            value={values.name}
            onChangeText={(text) => {
              handleChange("name")(text);
              setFieldTouched("name", true, false);
            }}
            onBlur={handleBlur("name") as any}
            error={touched.name && errors.name ? errors.name : undefined}
            icon="user"
          />

          <FormInput
            label={t("Username")}
            placeholder={t("Enter your username")}
            value={values.username}
            onChangeText={(text) => {
              handleChange("username")(text);
              setFieldTouched("username", true, false);
            }}
            onBlur={handleBlur("username") as any}
            error={touched.username && errors.username ? errors.username : undefined}
            icon="user"
            autoCapitalize="none"
          />

          <FormInput
            label={t("Email")}
            placeholder={t("Enter your email")}
            value={values.email}
            onChangeText={(text) => {
              handleChange("email")(text);
              setFieldTouched("email", true, false);
            }}
            onBlur={handleBlur("email") as any}
            error={touched.email && errors.email ? errors.email : undefined}
            icon="envelope"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomPhoneInput
            label={t("Phone Number")}
            value={values.phone}
            onChangeText={(text) => {
              setFieldValue("phone", text);
              setFieldTouched("phone", true, false);
            }}
            onBlur={handleBlur("phone") as any}
            error={touched.phone && errors.phone ? errors.phone : undefined}
          />

          <FormInput
            label={t("Password")}
            placeholder={t("Create a strong password")}
            value={values.password}
            onChangeText={(text) => {
              handleChange("password")(text);
              setFieldTouched("password", true, false);
            }}
            onBlur={handleBlur("password") as any}
            error={touched.password && errors.password ? errors.password : undefined}
            icon="lock"
            secureTextEntry
          />

          <FormInput
            label={t("Confirm Password")}
            placeholder={t("Re-enter your password")}
            value={values.confirmPassword}
            onChangeText={(text) => {
              handleChange("confirmPassword")(text);
              setFieldTouched("confirmPassword", true, false);
            }}
            onBlur={handleBlur("confirmPassword") as any}
            error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
            icon="lock"
            secureTextEntry
          />

          <VehicleSelector
            selectedVehicle={values.vehicleType}
            onSelect={(vehicleCode) => {
              setFieldValue("vehicleType", vehicleCode);
              setFieldTouched("vehicleType", true, false);
            }}
            error={touched.vehicleType && errors.vehicleType ? errors.vehicleType : undefined}
          />

          <ZoneSelector
            zones={zones}
            selectedZone={values.zone}
            onSelect={(zoneId) => {
              setFieldValue("zone", zoneId);
              setFieldTouched("zone", true, false);
            }}
            error={touched.zone && errors.zone ? errors.zone : undefined}
            loading={zonesLoading}
          />

          <FormInput
            label={t("Referral Code (Optional)")}
            placeholder={t("Enter referral code")}
            value={values.referralCode}
            onChangeText={(text) => {
              handleChange("referralCode")(text);
              setFieldTouched("referralCode", true, false);
            }}
            onBlur={handleBlur("referralCode") as any}
            error={touched.referralCode && errors.referralCode ? errors.referralCode : undefined}
            icon="gift"
          />

          <CustomContinueButton
            title={isSubmitting ? t("Creating Account...") : t("Sign Up")}
            onPress={() => {
              // Mark all fields as touched to show validation errors
              Object.keys(values).forEach((key) => {
                setFieldTouched(key, true, false);
              });
              handleSubmit();
            }}
            disabled={isSubmitting}
            className="mt-4"
          />
        </View>
      )}
    </Formik>
  );
}
