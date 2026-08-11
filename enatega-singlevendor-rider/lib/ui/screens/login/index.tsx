// Core
import { Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
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
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

// Schemas
import { SignInSchema } from "@/lib/utils/schema";
import { useTranslation } from "react-i18next";

// Hooks
import useLogin from "@/lib/hooks/useLogin";

// Interface
import { useApolloClient } from "@apollo/client";
import { useApptheme } from "@/lib/context/global/theme.context";
import { ILoginInitialValues } from "@/lib/utils/interfaces";
import { CustomContinueButton } from "../../useable-components";
import { useRiderMode } from "@/lib/context/global/rider-mode.context";
import { RIDER_SERVER_MODES, RiderServerMode } from "@/lib/mode/rider-mode";

const multiVendorDemoCredentials: ILoginInitialValues = {
  username:
    process.env.EXPO_PUBLIC_MULTI_VENDOR_RIDER_DEMO_USERNAME ??
    (__DEV__ ? "ryanabotreef" : ""),
  password:
    process.env.EXPO_PUBLIC_MULTI_VENDOR_RIDER_DEMO_PASSWORD ??
    (__DEV__ ? "Rider@123" : ""),
};

const singleVendorDemoCredentials: ILoginInitialValues = {
  username:
    process.env.EXPO_PUBLIC_SINGLE_VENDOR_RIDER_DEMO_USERNAME ??
    (__DEV__ ? "enategaRider@gmail.com" : ""),
  password:
    process.env.EXPO_PUBLIC_SINGLE_VENDOR_RIDER_DEMO_PASSWORD ??
    (__DEV__ ? "Enatega@123" : ""),
};

const LoginScreen = () => {
  // States
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Hooks
  const { appTheme } = useApptheme();
  const client = useApolloClient();
  const { t } = useTranslation();
  const { onLogin, isLogging } = useLogin();
  const { isModeSelectionLocked, mode, selectMode } = useRiderMode();
  const loginInitialValues = useMemo(
    () =>
      mode === RIDER_SERVER_MODES.MULTI
        ? multiVendorDemoCredentials
        : singleVendorDemoCredentials,
    [mode],
  );

  // Handlers
  const onLoginHandler = async (creds: ILoginInitialValues) => {
    try {
      await onLogin(creds.username.toLowerCase(), creds.password);
    } catch (err: unknown) {
      if (__DEV__) {
        console.log(err);
      }
    }
  };

  // Clear any stale Apollo cache once when the login screen mounts (e.g. after
  // logout) — not on every `creds` change, which would abort in-flight queries.
  useEffect(() => {
    client
      ?.clearStore()
      .catch((err) => __DEV__ && console.log("Apollo clearStore error:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onModeSelected = async (nextMode: RiderServerMode) => {
    if (isLogging) return;
    await selectMode(nextMode);
  };

  if (isLogging) {
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
      <SafeAreaView
        style={{ flex: 1, backgroundColor: appTheme.themeBackground }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Formik
            initialValues={loginInitialValues}
            enableReinitialize
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
                    {(
                      [
                        [RIDER_SERVER_MODES.MULTI, t("Multi Vendor")],
                        [RIDER_SERVER_MODES.SINGLE, t("Single Vendor")],
                      ] as const
                    ).map(([serverMode, label]) => {
                      const selected = mode === serverMode;
                      return (
                        <TouchableOpacity
                          key={serverMode}
                          accessibilityRole="button"
                          accessibilityState={{ selected }}
                          disabled={isLogging}
                          onPress={() => void onModeSelected(serverMode)}
                          className="flex-1 flex-row items-center justify-center px-2"
                          style={{
                            backgroundColor: selected
                              ? `${appTheme.primary}12`
                              : "transparent",
                            borderBottomColor: selected
                              ? appTheme.primary
                              : "transparent",
                            borderBottomWidth: 2,
                          }}
                        >
                          <FontAwesome6
                            name={
                              serverMode === RIDER_SERVER_MODES.MULTI
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
                            className="text-sm font-semibold"
                            style={{
                              color: selected
                                ? appTheme.primary
                                : appTheme.fontSecondColor,
                            }}
                          >
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    </View>
                  )}

                  <View className="flex-1 w-full p-5 items-center justify-center gap-y-2">
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
                    <CustomContinueButton
                      title={t("Login")}
                      onPress={() => handleSubmit()}
                      disabled={isLogging}
                      className="self-center"
                    />
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
