"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const PlayStoreLink =
  "https://play.google.com/store/apps/details?id=com.enatega.multivendor&hl=en_IE";
const AppleStoreLink =
  "https://apps.apple.com/pk/app/enatega-multivendor/id1526488093";
import Logo from "@/lib/utils/assets/svg/Logo";
import { useTranslations } from "next-intl";

const AppLinks = () => {

  const t = useTranslations()
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const handleButtonClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  const logoClickHandler = () => {
    if (isLogin) {
      router.push("/");
    }
    router.push("/");
  };

  return (
    <div>
      <div className="text-[20px] mb-4 font-extrabold text-white cursor-pointer" onClick={logoClickHandler}>
        <Logo fillColor="#FFFFFFFF" darkmode="#FFFFFFFF" />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => handleButtonClick(AppleStoreLink)}>
          <Image
            alt={t("apple_app_store_link")}
            width={130}
            height={130}
            src={
              "https://images.ctfassets.net/23u853certza/7xaqvusYmbDlca5umD9bZo/a0fa3e1c7ca41a70c6285d6c7b18c92b/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
            }
          />
        </button>
        <button onClick={() => handleButtonClick(PlayStoreLink)}>
          <Image
            alt={t("google_play_store_link")}
            width={130}
            height={130}
            src={
              "https://images.ctfassets.net/23u853certza/1Djo4jOj0doR5PfWVzj9O6/d52acac7f94db66263f5ad9e01c41c82/google-play-badge.png"
            }
          />
        </button>
      </div>
    </div>
  );
};

export default AppLinks;
