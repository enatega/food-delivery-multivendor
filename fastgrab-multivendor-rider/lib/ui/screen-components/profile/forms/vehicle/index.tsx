// Core
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Components
import { CustomContinueButton } from "@/lib/ui/useable-components";
import FormHeader from "../form-header";

// Expo
import * as ImagePicker from "expo-image-picker";
import { Link } from "expo-router";

// Icons
import { UploadIcon } from "@/lib/assets/svg";
import { Ionicons } from "@expo/vector-icons";

// Skeletons
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

// Flash Message
import { showMessage } from "react-native-flash-message";

// GraphQL
import { UPDATE_VEHICLE } from "@/lib/apollo/mutations/rider.mutation";
import { RIDER_PROFILE } from "@/lib/apollo/queries";

// Types & Interfaces
import { ICloudinaryResponse } from "@/lib/utils/interfaces/cloudinary.interface";
import { TRiderProfileBottomBarBit } from "@/lib/utils/types/rider";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

export default function VehiclePlateForm({
  setIsFormOpened,
}: {
  setIsFormOpened: Dispatch<SetStateAction<TRiderProfileBottomBarBit>>;
}) {
  // Hooks
  const { t } = useTranslation();
  const { userId, dataProfile } = useUserContext();
  const { appTheme, currentTheme } = useApptheme();

  // States
  const [isLoading, setIsLoading] = useState({
    isUploading: false,
    isSubmitting: false,
  });
  const [cloudinaryResponse, setCloudinaryResponse] =
    useState<ICloudinaryResponse | null>(null);
  const [formData, setFormData] = useState({
    image: "",
    number: "",
  });
  // Mutations
  const [mutateLicense] = useMutation(UPDATE_VEHICLE, {
    onError: (error) => {
      showMessage({
        message: t("Failed to update license"),
        type: "danger",
      });
      console.log("Failed to update license", error);
    },
    onCompleted: () => {
      setIsLoading({
        isSubmitting: false,
        isUploading: false,
      });
    },
    refetchQueries: [{ query: RIDER_PROFILE, variables: { id: userId } }],
  });

  const pickImage = async () => {
    try {
      setIsLoading((prev) => ({
        ...prev,
        isUploading: true,
      }));

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const formData = new FormData();
        formData.append("file", {
          uri: result.assets[0].uri,
          name: `license_${Date.now()}.jpg`,
          type: "image/jpeg",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        // ✅ Make sure upload_preset is inside formData, not in the URL
        formData.append("upload_preset", "rider_data");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/do1ia4vzf/image/upload",
          {
            method: "POST",
            body: formData,
          },
        );

        const data: ICloudinaryResponse = await response.json();
        if (!response.ok) {
          throw new Error(data?.error?.message || "Failed to upload image");
        }

        setCloudinaryResponse(data);
        setFormData((prev) => ({ ...prev, image: data.secure_url }));
      }
    } catch (error) {
      console.log(error);
      // showMessage({
      //   message: t("Failed to upload image"),
      //   type: "danger",
      // });
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        isUploading: false,
      }));
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading((prev) => ({
        ...prev,
        isSubmitting: true,
      }));
      if (!formData.number) {
        return showMessage({
          message: t("Please enter a plate number"),
          type: "danger",
        });
      } else if (!formData.image) {
        return showMessage({
          message: t("Please upload an image"),
          type: "danger",
        });
      }
      await mutateLicense({
        variables: {
          updateRiderVehicleDetailsId: userId,
          vehicleDetails: formData,
        },
      });
      setIsFormOpened(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  useEffect(() => {
    setFormData({
      number: dataProfile?.vehicleDetails?.number ?? "",
      image: dataProfile?.vehicleDetails?.image ?? "",
    });
  }, []);
  return (
    <View className="w-full">
       <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex flex-col justify-between w-full p-2 h-[90%] mt-0 ">
          <FormHeader title={t("Vehicle Plate")} />
          <View>
            <View className="flex flex-col w-full my-2">
              <Text style={{ color: appTheme.fontMainColor }}>
                {t("Plate No")}
              </Text>
              <TextInput
                value={formData.number}
                onChangeText={(licenseNo) =>
                  handleInputChange("number", licenseNo)
                }
                style={{
                  borderColor: appTheme.borderLineColor,
                  color: appTheme.fontMainColor,
                }}
                className="w-full rounded-md border p-3 my-2"
              />
            </View>
            <View className="flex flex-col w-full my-2">
              <Text style={{ color: appTheme.fontMainColor }}>
                {t("Add Registration Document")}
              </Text>
              {!cloudinaryResponse?.secure_url ? (
                <TouchableOpacity
                  className="w-full rounded-md border border-dashed  p-3 h-28 items-center justify-center"
                  style={{ borderColor: appTheme.borderLineColor }}
                  onPress={pickImage}
                >
                  {isLoading.isUploading ? (
                    <MotiView>
                      <Skeleton
                        width={50}
                        height={50}
                        colorMode={currentTheme ?? "light"}
                      />
                    </MotiView>
                  ) : (
                    <UploadIcon />
                  )}
                </TouchableOpacity>
              ) : (
                <View className="flex flex-row justify-between border  rounded-md p-4 my-2">
                  <View className="flex flex-row gap-2">
                    <Ionicons name="image" size={20} color="#3F51B5" />
                    <Text
                      className="text-[#3F51B5] border-b-2 border-b-[#3F51B5]"
                      style={{ color: appTheme.fontSecondColor }}
                    >
                      {cloudinaryResponse.original_filename}.
                      {cloudinaryResponse.format}
                    </Text>
                  </View>
                  <View className="flex flex-row">
                    <Text style={{ color: appTheme.fontSecondColor }}>
                      {cloudinaryResponse.bytes / 1000}KB
                    </Text>
                    <Link
                      download={cloudinaryResponse.secure_url}
                      href={cloudinaryResponse.secure_url}
                      className="text-[#9CA3AF] text-xs"
                    >
                      <Ionicons size={18} name="download" color="#6B7280" />
                    </Link>
                  </View>
                </View>
              )}
            </View>
            <View>
              <CustomContinueButton
                title={isLoading.isSubmitting ? t("Please wait") : t("Add")}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
