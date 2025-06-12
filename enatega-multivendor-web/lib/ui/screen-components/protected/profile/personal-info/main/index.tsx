"use client";
import { GET_USER_PROFILE } from "@/lib/api/graphql";
import ProfileDetailsSkeleton from "@/lib/ui/useable-components/custom-skeletons/profile.details.skelton";
import TextComponent from "@/lib/ui/useable-components/text-field";
import { getInitials } from "@/lib/utils/methods";
import { useQuery } from "@apollo/client";
import UpdatePhoneModal from "../../settings/main/update-phone";
import { useState } from "react";
import "primeicons/primeicons.css";

export default function PersonalInfoMain() {
  const [isUpdatePhoneModalVisible, setIsUpdatePhoneModalVisible] =
    useState<boolean>(false);

  // Get profile data by using the query
  const { data: profileData, loading: profileLoading } = useQuery(
    GET_USER_PROFILE,
    {
      fetchPolicy: "network-only",
    }
  );

  // Get initials from the name
  const initials = getInitials(profileData?.profile?.name);

  const handleUpdatePhoneModal = () => {
    setIsUpdatePhoneModalVisible(!isUpdatePhoneModalVisible);
  };

  if (!profileLoading) {
    return (
      <div className="p-6 w-full bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          {/* Custom Avatar with Tailwind */}
          <div className="relative h-16 w-16 flex-shrink-0 bg-[#F3FFEE] rounded-full border-2 border-white shadow-sm shadow-gray-400">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-sm font-medium text-gray-500">
              {initials}
            </div>
          </div>
          <TextComponent
            text={profileData?.profile?.name || "N/A"}
            className="md:text-xl text-lg font-semibold text-gray-900"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <TextComponent
              text="Email"
              className="text-black font-semibold text-base md:text-lg"
            />
            <TextComponent
              text={profileData?.profile?.email || "N/A"}
              className="font-normal text-sm md:text-base"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">

            <TextComponent
              text="Phone number"
              className="text-black font-semibold text-base md:text-lg"
            />
             <i  onClick={handleUpdatePhoneModal} className="pi pi-pen-to-square cursor-pointer text-sm"></i>
            </div>
            <h1
              onClick={handleUpdatePhoneModal}
              title="Update phone number"
              className=" text-blue-700 font-normal text-sm md:text-base cursor-pointer"
            >           
              {profileData?.profile?.phone || "N/A"}
            </h1>
          </div>
        </div>
        <UpdatePhoneModal
          handleUpdatePhoneModal={handleUpdatePhoneModal}
          isUpdatePhoneModalVisible={isUpdatePhoneModalVisible}
        />
      </div>
    );
  } else {
    return <ProfileDetailsSkeleton />;
  }
}
