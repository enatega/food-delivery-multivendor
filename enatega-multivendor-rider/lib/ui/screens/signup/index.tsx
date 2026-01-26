import { useApptheme } from "@/lib/context/global/theme.context";
import useSignup from "@/lib/hooks/useSignup";
import { ISignUpInitialValues } from "@/lib/utils/interfaces/auth.interface";
import { useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { gql } from "@apollo/client";
import SignUpFormHeader from "../../screen-components/signup/form-header";
import SignUpForm from "../../screen-components/signup/signup-form";
import SuccessModal from "../../screen-components/signup/success-modal";
import { FontAwesome } from "@expo/vector-icons";

const GET_ZONES = gql`
  query Zones {
    zones {
      _id
      title
      description
      isActive
    }
  }
`;

export default function SignUpScreen() {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { onSignup, loading: signupLoading, error } = useSignup();
  const { data: zonesData, loading: zonesLoading } = useQuery(GET_ZONES);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const zones = zonesData?.zones?.filter((zone: any) => zone.isActive) || [];

  const handleSignup = async (values: ISignUpInitialValues) => {
    setErrorMessage(null);
    const result = await onSignup(values);

    if (result.success) {
      setShowSuccessModal(true);
    } else {
      setErrorMessage(result.error || "Signup failed. Please try again.");
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.back();
  };

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ backgroundColor: appTheme.themeBackground }}
    >
      <SafeAreaView className="flex-1">
        {/* Header with Back Button */}
        <View className="flex-row items-center px-5 py-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 p-2"
          >
            <FontAwesome
              name="arrow-left"
              size={20}
              color={appTheme.fontMainColor}
            />
          </TouchableOpacity>
          <Text
            className="text-lg font-semibold"
            style={{ color: appTheme.fontMainColor }}
          >
            {t("Sign Up")}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="px-5 pt-4">
            <SignUpFormHeader />

            {errorMessage && (
              <View
                className="p-4 rounded-lg mb-4 flex-row items-center"
                style={{ backgroundColor: "#fee2e2" }}
              >
                <FontAwesome name="exclamation-circle" size={16} color="#dc2626" />
                <Text className="text-sm ml-2 flex-1" style={{ color: "#dc2626" }}>
                  {errorMessage}
                </Text>
              </View>
            )}

            <SignUpForm
              onSubmit={handleSignup}
              zones={zones}
              zonesLoading={zonesLoading}
              isSubmitting={signupLoading}
            />

            {/* Login Link */}
            <View className="mt-6 flex-row items-center justify-center">
              <Text
                className="text-sm"
                style={{ color: appTheme.fontSecondColor }}
              >
                {t("Already have an account?")}{" "}
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: appTheme.primary }}
                >
                  {t("Login")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      <SuccessModal visible={showSuccessModal} onClose={handleSuccessClose} />
    </KeyboardAvoidingView>
  );
}
