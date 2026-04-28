"use client";

import ProfileHeader from "@/lib/ui/screen-components/protected/layout/profile/profile-header";
import ProfileTabs from "@/lib/ui/screen-components/protected/layout/profile/profile-tabs";
import { PaddingContainer } from "@/lib/ui/useable-components/containers";
import { IProtectedProfileLayoutComponent } from "@/lib/utils/interfaces";
// import { usePathname, useRouter } from "next/navigation";


export default function ProfileLayout({
  children,
}: IProtectedProfileLayoutComponent) {

  return (
    <div className="w-screen h-auto flex flex-col pb-20">
      <div className="flex flex-col justify-center space-y-6 items-center py-4 px-4  md:px-6 lg:px-12 xl:px-20 2xl:px-[80px] ">
        <ProfileHeader />
        <ProfileTabs />
      </div>
      <div className="flex-1 overflow-auto px-4 md:px-0 lg:px-28 xl:px-40">
        {/* Scrollable Content */}
        <PaddingContainer>
          {children}
        </PaddingContainer>

      </div>
    </div>
  );
}
