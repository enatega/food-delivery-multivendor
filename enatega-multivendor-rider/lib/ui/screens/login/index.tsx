// Core
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// React Native
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Components

// Icon
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';


// Schemas
import { SignInSchema } from "@/lib/utils/schema";
import { useTranslation } from "react-i18next";

// Hooks
import useLogin from "@/lib/hooks/useLogin";

// Interface
import setupApollo from "@/lib/apollo";
import { useApptheme } from "@/lib/context/global/theme.context";
import { ILoginInitialValues } from "@/lib/utils/interfaces";
import { CustomContinueButton } from "../../useable-components";
import { set } from "lodash";

const initial: ILoginInitialValues = {
  username: "",
  password: "",
};

const LoginScreen = () => {
  // States
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [initialValues, setInitialValues] = useState(initial);

  // Hooks
  const { appTheme } = useApptheme();
  const client = setupApollo();
  const { t } = useTranslation();
  const { onLogin, creds, isLogging } = useLogin();
  const [loading, setLoading] = useState(false);

  // Handlers
  const onLoginHandler = async (creds: ILoginInitialValues) => {
    // TODO: Implement login logic
    try {
      setLoading(true);
      await onLogin(creds.username.toLowerCase(), creds.password);
    } catch (err: unknown) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onInit = () => {
    try {
      client
        ?.clearStore()
        .catch((err) => console.log("Apollo clearStore error:", err));

      if (!creds?.username) return;
      setInitialValues(creds);
    } catch (err) {
      console.log("error login", err);
    }
  };

  // Use Effect
  useEffect(() => {
    onInit();
  }, [creds]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{t("Loading...")}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ height: height * 1 }}
        >
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={SignInSchema}
            onSubmit={onLoginHandler}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
              return (
                <View className="mt-24 p-5 items-center justify-between gap-y-2">
                  {/* Icon */}
                  <FontAwesome
                    name="envelope"
                    size={30}
                    color={appTheme.fontMainColor}
                  />

                  {/* Title */}
                  <Text
                    className="text-center text-xl font-semibold "
                    style={{ color: appTheme.fontMainColor }}
                  >
                    {t("Enter Your Credentials to login")}
                  </Text>
                  <Text
                    className="text-center text-sm mb-5"
                    style={{ color: appTheme.fontSecondColor }}
                  >
                    {t("We'll check if you have an account")}
                  </Text>

                  {/* Email Input */}

                  <View
                    className="flex-row items-center border rounded-lg px-3  mb-[-4]"
                    style={{
                      borderColor: appTheme.borderLineColor,
                      backgroundColor: appTheme.themeBackground,
                    }}
                  >
                    <TextInput
                      className="flex-1 h-12 text-base"
                      style={{ color: appTheme.fontMainColor }}
                      placeholder={t("Email")}
                      placeholderTextColor={appTheme.fontSecondColor}
                      keyboardType="email-address"
                      inputMode="email"
                      value={values.username}
                      onChangeText={handleChange("username")}
                      onBlur={handleBlur("username")}
                    />
                  </View>
                  {errors.username && (
                    <Text className="mb-2 text-sm text-red-500">
                      {errors?.username}
                    </Text>
                  )}

                  {/* Password Input */}
                  <View
                    className="flex-row items-center border  rounded-lg px-3  mb-[-4]"
                    style={{
                      backgroundColor: appTheme.themeBackground,
                      borderColor: appTheme.borderLineColor,
                    }}
                  >
                    <TextInput
                      className="flex-1 h-12 text-base"
                      style={{ color: appTheme.fontMainColor }}
                      placeholder={t("Password")}
                      secureTextEntry={!passwordVisible}
                      placeholderTextColor={appTheme.fontSecondColor}

                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                      className="ml-2"
                    >
                      <FontAwesome6
                        name={passwordVisible ? "eye-slash" : "eye"}
                        size={14}
                        color={appTheme.fontMainColor}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text className="mb-2 text-sm text-red-500">
                      {errors?.password}
                    </Text>
                  )}

                  {/* Login Button */}
                  <CustomContinueButton
                    title={t("Login")}
                    onPress={() => handleSubmit()}
                    className="self-center"
                  />
                  {/* <TouchableOpacity
                    className="h-12 rounded-3xl py-2 mt-10 w-full"
                    style={{ backgroundColor: appTheme.primary }}
                    onPress={() => handleSubmit()}
                  >
                    {isLogging ?
                      <SpinnerComponent />
                    : <Text
                        className="text-center text-lg font-medium"
                        style={{ color: appTheme.black }}
                      >
                        {t("Login")}
                      </Text>
                    }
                  </TouchableOpacity> */}
                </View>
              );
            }}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
