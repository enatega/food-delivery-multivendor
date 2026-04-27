// Core
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FormHeader from "../form-header";

// React Native Calendars
// import { Calendar, DateData } from 'react-native-calendars'

// RNC Calendar
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

// Flash Message
import { showMessage } from "react-native-flash-message";

// Icons
import { UploadIcon } from "@/lib/assets/svg";
import { Ionicons } from "@expo/vector-icons";

// Components
import { CustomContinueButton } from "@/lib/ui/useable-components";

// Expo
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Link } from "expo-router";

// Skeleton
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

// Hooks
import { useUserContext } from "@/lib/context/global/user.context";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

// GraphQL
import { UPDATE_LICENSE, UPLOAD_IMAGE_TO_S3 } from "@/lib/apollo/mutations/rider.mutation";
import { RIDER_PROFILE } from "@/lib/apollo/queries";

// Interfaces
import { useApptheme } from "@/lib/context/global/theme.context";
import { TRiderProfileBottomBarBit } from "@/lib/utils/types/rider";

type IOSMode = "date" | "time" | "datetime" | "countdown";
type AndroidMode = "date" | "time";
export default function DrivingLicenseForm({
  setIsFormOpened,
}: {
  setIsFormOpened: Dispatch<SetStateAction<TRiderProfileBottomBarBit>>;
}) {
  // Hooks
  const { t } = useTranslation();
  const { userId, dataProfile } = useUserContext();
  const { appTheme } = useApptheme();

  // States
  const [isLoading, setIsLoading] = useState({
    isUploading: false,
    isCalendarVisible: false,
    isSubmitting: false,
  });
  // const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    expiryDate: new Date(),
    image: "",
    number: "",
  });
  const [error, setError] = useState<{
    field: "image" | "number" | "expiryDate" | null;
    message: string | null;
  }>({
    field: null,
    message: null,
  });

  // Mutations
  const [uploadImageToS3] = useMutation(UPLOAD_IMAGE_TO_S3);
  
  const [mutateLicense] = useMutation(UPDATE_LICENSE, {
    onError: (error) => {
      showMessage({
        message: t("Failed to update license"),
        type: "danger",
      });
      console.log("Failed to update license", error);
      setError({
        field: "image",
        message: t("Failed to upload image"),
      });
    },
    onCompleted: () => {
      setIsLoading({
        isCalendarVisible: false,
        isSubmitting: false,
        isUploading: false,
      });
    },
    refetchQueries: [{ query: RIDER_PROFILE, variables: { id: userId } }],
  });

  // Handlers
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
        console.log("Reading image as base64...");
        const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        console.log("Base64 length:", base64.length);
        console.log("Uploading to S3...");
        
        const { data, errors } = await uploadImageToS3({
          variables: {
            image: `data:image/jpeg;base64,${base64}`,
          },
        });

        console.log("S3 response:", data);
        console.log("S3 errors:", errors);

        if (errors && errors.length > 0) {
          throw new Error(errors[0].message || t("Failed to upload image"));
        }

        if (data?.uploadImageToS3?.imageUrl) {
          setUploadedImageUrl(data.uploadImageToS3.imageUrl);
          setFormData((prev) => ({ ...prev, image: data.uploadImageToS3.imageUrl }));
        } else {
          throw new Error(t("Failed to upload image"));
        }
      }
    } catch (error) {
      console.log(error);
      setError({
        field: "image",
        message: t("Failed to upload image"),
      });
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        isUploading: false,
      }));
    }
  };

  const onDateChange = (
    _: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    const currentDate = selectedDate;
    setShow(false);
    if (currentDate) {
      // setDate(currentDate);
      setFormData((prev) => ({
        ...prev,
        expiryDate: currentDate,
      }));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  // Handlers
  const handleInputChange = (name: string, value: string | Date) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading((prev) => ({
        ...prev,
        isSubmitting: true,
      }));
      if (!formData.expiryDate) {
        setError({
          field: "expiryDate",
          message: t("Please select an expiry date"),
        });
        return showMessage({
          message: t("Please select an expiry date"),
          type: "danger",
        });
      } else if (!formData.number) {
        setError({
          field: "number",
          message: t("Please enter a license number"),
        });
        return showMessage({
          message: t("Please enter a license number"),
          type: "danger",
        });
      } else if (!formData.image) {
        setError({
          field: "image",
          message: t("Please upload an image"),
        });
        return showMessage({
          message: t("Please upload an image"),
          type: "danger",
        });
      } else {
        console.log({ ...formData });
        await mutateLicense({
          variables: {
            updateRiderLicenseDetailsId: userId,
            licenseDetails: formData,
          },
        });
        setIsFormOpened(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  };

  // UseEffects
  useEffect(() => {
    setFormData({
      expiryDate: dataProfile?.licenseDetails?.expiryDate
        ? new Date(dataProfile?.licenseDetails?.expiryDate)
        : new Date(),
      image: dataProfile?.licenseDetails?.image ?? "",
      number: String(dataProfile?.licenseDetails?.number ?? ""),
    });
  }, [dataProfile]);

  return (
    <View className="w-full items-center justify-center">
      {!isLoading.isCalendarVisible && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            className={`flex flex-col justify-between w-full p-3 h-[95%] my-auto mt-0 -z-1`}
          >
            <FormHeader title={t("Driving License")} />
            <View>
              <View className="flex flex-col w-full mb-2">
                <Text style={{ color: appTheme.fontMainColor }}>
                  {t("License No")}
                </Text>
                <TextInput
                  value={formData.number}
                  onChangeText={(licenseNo) =>
                    handleInputChange("number", licenseNo)
                  }
                  className={`w-full rounded-md border ${error.field === "number" && error.message ? "border-red-600" : "border-gray-300"} p-3 my-2`}
                  style={{ color: appTheme.fontMainColor }}
                />
                {error.field === "number" && error.message && (
                  <Text className="text-red-600">{error.message}</Text>
                )}
              </View>
              <View className="flex flex-col w-full my-2">
                <Text style={{ color: appTheme.fontMainColor }}>
                  {t("License Expiry Date")}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    // setIsLoading((prev) => ({
                    //   ...prev,
                    //   isCalendarVisible: true,
                    // }))
                    showDatepicker();
                    Keyboard.dismiss();
                  }}
                  className={`w-full rounded-md border ${error.field === "expiryDate" && error.message ? "border-red-600" : "border-gray-300"} p-3 my-2`}
                >
                  {!show && (
                    <Text
                      className="text-gray-400"
                      style={{ color: appTheme.fontMainColor }}
                    >
                      {formData.expiryDate.toDateString()}
                    </Text>
                  )}
                  <View>
                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={formData.expiryDate}
                        style={{
                          borderColor: appTheme.borderLineColor,
                          backgroundColor: appTheme.themeBackground,
                        }}
                        mode={mode as IOSMode | AndroidMode | undefined}
                        onChange={onDateChange}
                      />
                    )}
                  </View>
                </TouchableOpacity>
                {error.field === "expiryDate" && error.message && (
                  <Text className="text-red-600">{error.message}</Text>
                )}
              </View>
              <View className="flex flex-col w-full my-2">
                <Text style={{ color: appTheme.fontMainColor }}>
                  {t("Add License Document")}
                </Text>
                {!uploadedImageUrl || !formData.image ? (
                  <TouchableOpacity
                    className={`w-full rounded-md border border-dashed ${error.field === "image" && error.message ? "border-red-600" : "border-gray-300"} p-3 h-28 items-center justify-center`}
                    onPress={pickImage}
                  >
                    {isLoading.isUploading ? (
                      <MotiView>
                        <Skeleton width={90} height={20} colorMode="light" />
                      </MotiView>
                    ) : (
                      <UploadIcon />
                    )}
                    {error.field === "image" && error.message && (
                      <Text className="text-red-600">{error.message}</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View className="flex flex-row justify-between border border-gray-300 rounded-md p-4 my-2">
                    <View className="flex flex-row gap-2">
                      <Ionicons name="image" size={20} color="#3F51B5" />
                      <Text className="text-[#3F51B5] border-b-2 border-b-[#3F51B5]">
                        license_image.jpg
                      </Text>
                    </View>
                    <View className="flex flex-row">
                      <Link
                        download={uploadedImageUrl ?? formData.image}
                        href={uploadedImageUrl ?? formData.image}
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
                  style={{ marginTop: 20 }}
                  title={isLoading.isSubmitting ? t("Please wait") : t("Add")}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}
