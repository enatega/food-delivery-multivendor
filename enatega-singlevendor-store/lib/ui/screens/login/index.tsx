// Core
import { Formik } from "formik";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// React Native
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
// Components
// Icon
import Icon from "react-native-vector-icons/FontAwesome6";
// Schemas
import { SignInSchema } from "@/lib/utils/schema";
// Hook
import useLogin from "@/lib/hooks/useLogin";
// Interface
import { useApptheme } from "@/lib/context/theme.context";
import { ILoginInitialValues } from "@/lib/utils/interfaces";
import { useTranslation } from "react-i18next";
import { CustomContinueButton } from "../../useable-components";
import { useStoreMode } from "@/lib/context/global/store-mode.context";
import { STORE_SERVER_MODES, StoreServerMode } from "@/lib/mode/store-mode";

const multiVendorDemoCredentials: ILoginInitialValues = {
  username:
    process.env.EXPO_PUBLIC_MULTI_VENDOR_STORE_DEMO_USERNAME ??
    (__DEV__ ? "FalafelTmeer@yopmail.com" : ""),
  password:
    process.env.EXPO_PUBLIC_MULTI_VENDOR_STORE_DEMO_PASSWORD ??
    (__DEV__ ? "Yalla0014yalla0014@" : ""),
};

const singleVendorDemoCredentials: ILoginInitialValues = {
  username:
    process.env.EXPO_PUBLIC_SINGLE_VENDOR_STORE_DEMO_USERNAME ??
    (__DEV__ ? "store@fastfresh.local" : ""),
  password:
    process.env.EXPO_PUBLIC_SINGLE_VENDOR_STORE_DEMO_PASSWORD ??
    (__DEV__ ? "Store@12345" : ""),
};

const LoginScreen = () => {
  // States
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Hooks
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const { isLogging, onLogin } = useLogin();
  const {
    isModeSelectionLocked,
    isSwitchingMode,
    mode,
    selectMode,
  } = useStoreMode();
  const loginInitialValues = useMemo(
    () =>
      mode === STORE_SERVER_MODES.MULTI
        ? multiVendorDemoCredentials
        : singleVendorDemoCredentials,
    [mode],
  );

  // Handlers
  const onLoginHandler = async (creds: ILoginInitialValues) => {
    await onLogin(creds.username, creds.password);
  };

  const onSelectMode = async (nextMode: StoreServerMode) => {
    if (isLogging || isSwitchingMode) return;
    await selectMode(nextMode);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center h-full w-full"
      style={{ backgroundColor: appTheme.themeBackground }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: appTheme.themeBackground,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Formik
            initialValues={loginInitialValues}
            enableReinitialize={true}
            validationSchema={SignInSchema}
            onSubmit={onLoginHandler}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => {
              return (
                <View className="flex-1 items-center">
                  {!isModeSelectionLocked && (
                    <View
                      className="flex-row self-stretch"
                      style={{
                        minHeight: 56,
                        borderBottomColor: appTheme.borderLineColor,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      }}
                    >
                    {[
                      {
                        label: t("Multi Vendor"),
                        value: STORE_SERVER_MODES.MULTI,
                      },
                      {
                        label: t("Single Vendor"),
                        value: STORE_SERVER_MODES.SINGLE,
                      },
                    ].map((option) => {
                      const selected = mode === option.value;
                      return (
                        <TouchableOpacity
                          key={option.value}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          disabled={isLogging || isSwitchingMode}
                          onPress={() => onSelectMode(option.value)}
                          className="flex-1 flex-row items-center justify-center px-2"
                          style={{
                            backgroundColor: selected
                              ? `${appTheme.primary}12`
                              : "transparent",
                            borderBottomColor: selected
                              ? appTheme.primary
                              : "transparent",
                            borderBottomWidth: 2,
                            opacity: isLogging || isSwitchingMode ? 0.65 : 1,
                          }}
                        >
                          <Icon
                            name={
                              option.value === STORE_SERVER_MODES.MULTI
                                ? "grip"
                                : "store"
                            }
                            size={16}
                            color={
                              selected
                                ? appTheme.primary
                                : appTheme.fontSecondColor
                            }
                            style={{ marginRight: 8 }}
                          />
                          <Text
                            className="text-center text-sm font-semibold"
                            style={{
                              color: selected
                                ? appTheme.primary
                                : appTheme.fontSecondColor,
                            }}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    </View>
                  )}

                  <View className="flex-1 w-full p-5 items-center justify-center gap-y-2">
                    {/* Icon */}
                    <Icon name="envelope" size={30} color={appTheme.primary} />

                    {/* Title */}
                    <Text
                      className="text-center text-xl font-semibold"
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
                        backgroundColor: appTheme.themeBackground,
                        borderColor: appTheme.borderLineColor,
                      }}
                    >
                      <TextInput
                        className="flex-1 h-12 text-bas"
                        style={{ color: appTheme.fontMainColor }}
                        placeholder={t("Username or Email")}
                        value={values.username}
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                      />
                    </View>
                    {errors.username && (
                      <Text
                        style={{
                          color: appTheme.textErrorColor,
                          marginBottom: 8,
                          fontSize: 14,
                        }}
                      >
                        {errors?.username}
                      </Text>
                    )}

                    {/* Password Input */}
                    <View
                      className="flex-row items-center border rounded-lg px-3 mb-[-4]"
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
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                      />
                      <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        className="ml-2"
                      >
                        <Icon
                          name={passwordVisible ? "eye-slash" : "eye"}
                          size={14}
                          color={appTheme.fontMainColor}
                        />
                      </TouchableOpacity>
                    </View>

                    {errors.password && (
                      <Text
                        style={{
                          color: appTheme.textErrorColor,
                          marginBottom: 8,
                          fontSize: 14,
                        }}
                      >
                        {errors?.password}
                      </Text>
                    )}
                    {/* Login Button */}
                    <CustomContinueButton
                      title={t("Login")}
                      disabled={isLogging || isSwitchingMode}
                      isLoading={isLogging}
                      onPress={() => handleSubmit()}
                    />
                    {/* <TouchableOpacity
                    className="h-12 rounded-3xl py-3 mt-10 w-full"
                    style={{ backgroundColor: appTheme.primary }}
                    onPress={() => handleSubmit()}
                  >
                    {isLogging ? (
                      <SpinnerComponent />
                    ) : (
                      <Text
                        className="text-center  text-lg font-medium"
                        style={{ color: appTheme.fontMainColor }}
                      >
                        {t("Login")}
                      </Text>
                    )}
                  </TouchableOpacity> */}
                  </View>
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
