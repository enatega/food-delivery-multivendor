"use client";
import type React from "react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
// Api
import { DEACTIVATE_USER, GET_USER_PROFILE } from "@/lib/api/graphql";
import { useMutation, useQuery } from "@apollo/client";
// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomInputSwitch from "@/lib/ui/useable-components/custom-input-switch";
import ProfileSettingsSkeleton from "@/lib/ui/useable-components/custom-skeletons/profile.settings.skelton";
import TextComponent from "@/lib/ui/useable-components/text-field";
import DeleteAccountDialog from "./delete-account";
import UpdatePhoneModal from "./update-phone";
// Context
import { useAuth } from "@/lib/context/auth/auth.context";
// Hooks
import useToast from "@/lib/hooks/useToast";
import NameUpdateModal from "./update-name";
import { useTranslations } from "next-intl";
import { Dialog } from "primereact/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import ThemeToggle from "@/lib/ui/useable-components/theme-button";

export default function SettingsMain() {
  // States for current values
  const [sendReceipts, setSendReceipts] = useState<boolean>(false);
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteReason, setDeleteReason] = useState<string>("");
  const [logoutConfirmationVisible, setLogoutConfirmationVisible] =
    useState(false);

  const [isUpdatePhoneModalVisible, setIsUpdatePhoneModalVisible] =
    useState<boolean>(false);
  const [isUpdateNameModalVisible, setIsUpdateNameModalVisible] =
    useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Hooks
  const { setAuthToken } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const t = useTranslations();

  // Queries and Mutations
  // Get profile data by using the query
  const { data: profileData, loading: isProfileLoading } = useQuery(
    GET_USER_PROFILE,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  // Update user muattion
  const [Deactivate] = useMutation(DEACTIVATE_USER, {
    onCompleted: () => {
      showToast({
        type: "success",
        title: t("successToastTitle"),
        message: t("successToastMessage"),
      });
    },
    onError: (error) => {
      showToast({
        type: "error",
        title: "Error",
        message: error.message,
      });
    },
  });

  // Handle Delete Account button click
  const handleDeleteAccount = () => {
    setDeleteAccount(true);
  };

  // Handle send receipts toggle
  const handleSendReceiptsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setSendReceipts(newValue);
    // You can use a mutation to update the user's settings
  };
  //  handle Logout
  const handleLogout = () => {
    // Add your logout logic here
    // e.g., clear cookies, redirect to login page, etc.
    setAuthToken("");
    localStorage.clear();
    showToast({
      type: "success",
      title: t("logoutSuccessToastTitle"),
      message: t("logoutSuccessToastMessage"),
    });
    router.push("/");
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    // Simulate API call
    setTimeout(() => {
      // Actual Mutation Delete Logic implement here
      Deactivate({
        variables: {
          isActive: false,
          email: profileData?.profile?.email,
        },
      });
      // Clear auth token and local storage
      setAuthToken("");
      localStorage.clear();
      setIsDeleting(false);
      setDeleteAccount(false);
      router.push("/");
    }, 1500);
  };

  // Close delete dialog
  const handleCancelDelete = useCallback(() => {
    setDeleteAccount(false);
  }, []);

  const handleUpdatePhoneModal = () => {
    setIsUpdatePhoneModalVisible(!isUpdatePhoneModalVisible);
  };
  const handleUpdateNameModal = () => {
    setIsUpdateNameModalVisible(!isUpdateNameModalVisible);
  };

  if (isProfileLoading) {
    return <ProfileSettingsSkeleton />;
  }

  return (
    <div className="w-full mx-auto bg-white dark:bg-gray-900">
      <DeleteAccountDialog
        visible={deleteAccount}
        onHide={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userName={
          profileData?.profile?.name ||
          profileData?.profile?.email?.split("@")[0] ||
          "User"
        }
        deleteReason={deleteReason}
        setDeleteReason={setDeleteReason}
        loading={isDeleting}
      />

      {/* Email */}
      <div className="py-4 border-b">
        <div className="flex justify-between items-center dark:border-gray-700">
          <TextComponent
            text={t("emailLabel")}
            className="font-normal text-gray-700 dark:text-gray-300 text-base md:text-lg "
          />
          <TextComponent
            text={profileData?.profile?.email}
            className="font-medium text-gray-700 dark:text-gray-100  text-base md:text-lg "
          />
        </div>
      </div>

      {/* Mobile Number */}
      <div className="py-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center ">
          <TextComponent
            text={t("mobileNumberLabel")}
            className="font-normal text-gray-700 dark:text-gray-300 text-base md:text-lg "
          />
          <div className="flex flex-col md:flex-row items-center gap-2">
            {!profileData?.profile?.phoneIsVerified && (
              <CustomButton
                onClick={handleUpdatePhoneModal}
                label={t("notVerifiedButton")}
                type="button"
                className="text-sm md:text-md font-light bg-[#dd1515c5] hover:bg-[#dd1515ab] px-[16px] py-[8px] text-white"
              />
            )}
            <h1
              title={t("updatePhoneTitle")}
              onClick={handleUpdatePhoneModal}
              className="font-medium text-blue-700 dark:text-blue-400 text-base md:text-lg  cursor-pointer"
            >
              {profileData?.profile?.phone || "N/A"}
            </h1>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="py-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <TextComponent
            text={t("nameLabel")}
            className="font-normal text-gray-700 dark:text-gray-300 text-base md:text-lg "
          />
          <h1
            title={t("updateNameTitle")}
            onClick={handleUpdateNameModal}
            className="font-medium text-blue-700 dark:text-blue-400 text-base md:text-lg  cursor-pointer"
          >
            {profileData?.profile?.name || "N/A"}
          </h1>
        </div>
      </div>

      {/* Delete Account */}
      <div className="py-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <TextComponent
            text={t("deleteAccountLabel")}
            className="font-normal text-gray-700 dark:text-gray-300 text-base md:text-lg "
          />
          <CustomButton
            label={t("deleteButton")}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500 font-medium text-base md:text-lg  "
            onClick={handleDeleteAccount}
          />
        </div>
      </div>

      {/* Send Receipts */}
      <div className="py-4 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <TextComponent
            text={t("sendReceiptsLabel")}
            className="font-normal text-gray-700 dark:text-gray-300 text-base md:text-lg "
          />
          <CustomInputSwitch
            isActive={sendReceipts}
            onChange={handleSendReceiptsChange}
          />
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <TextComponent
            text={t("theme")}
            className="font-normal text-gray-700 dark:text-gray-300 text-base md:text-lg"
          />
          <ThemeToggle />
        </div>
      </div>

      {/* Update Phone Modal */}
      <UpdatePhoneModal
        handleUpdatePhoneModal={handleUpdatePhoneModal}
        isUpdatePhoneModalVisible={isUpdatePhoneModalVisible}
        ActiveStep={activeStep}
        setActiveStep={setActiveStep}
        userPhone={profileData?.profile?.phone || ""}
      />

      {/* Upate Name MOdal */}
      <NameUpdateModal
        handleUpdateNameModal={handleUpdateNameModal}
        isUpdateNameModalVisible={isUpdateNameModalVisible}
        existedName={profileData?.profile?.name}
      />

      {/* Logout */}
      <div className="py-4">
        <div className="flex justify-between items-center">
          <TextComponent
            text={t("logoutLabel")}
            className="font-normal text-gray-700 dark:text-gray-300 text-base md:text-lg "
          />
          <CustomButton
            className="font-light text-gray-700 dark:text-gray-200 text-base lg:text-lg hover:text-gray-500"
            onClick={() => setLogoutConfirmationVisible(true)}
            label={t("logoutButton")}
          />
        </div>

        {/* Logout Confirmation Dialog */}
        <Dialog
          contentClassName="dark:bg-gray-800"
          maskClassName="bg-black/80"
          visible={logoutConfirmationVisible}
          onHide={() => setLogoutConfirmationVisible(false)}
          className="w-[95%] sm:w-[80%] md:w-[60%] lg:w-1/3 rounded-xl px-8 bg-white dark:bg-gray-800 dark:text-white"
          header={
            <div className="w-full flex justify-center">
              <span className="font-inter font-bold text-lg text-gray-800 dark:text-white">
                Are you sure you want to log out?
              </span>
            </div>
          }
          headerClassName="!justify-center dark:bg-gray-800"
          closable={true}
          dismissableMask
        >
          <div className="flex flex-col items-center text-center space-y-4 dark:bg-gray-800 dark:text-white">
            {/* Action buttons */}
            <div className="flex justify-center gap-3 w-full">
              <CustomButton
                label="Cancel"
                className="w-1/2 h-fit bg-transparent text-gray-900 dark:text-white py-2 border border-gray-400 rounded-full text-sm font-medium"
                onClick={() => setLogoutConfirmationVisible(false)}
              />

              <button
                className="w-1/2 h-fit flex items-center justify-center gap-2 bg-[#5AC12F] text-white py-2 rounded-full text-sm font-medium"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
