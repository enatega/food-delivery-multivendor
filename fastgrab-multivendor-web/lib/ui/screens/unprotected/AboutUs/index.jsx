"use client";

import Image from "next/image";
import OnePara from "@/lib/ui/screen-components/un-protected/TermsConditions/OnePara";
import { useTranslations } from "next-intl";

const AboutUs = () => {
  const t = useTranslations();

  const AboutUsData = [
    {
      number: "1.",
      head: t("AboutUsPage_mission1"),
      paras: [t("AboutUsPage_mission2")],
    },
    {
      number: "2.",
      head: t("AboutUsPage_who3"),
      paras: [t("AboutUsPage_who4")],
    },
    {
      number: "3.",
      head: t("AboutUsPage_different5"),
      paras: [t("AboutUsPage_different6")],
    },
    {
      number: "4.",
      head: t("AboutUsPage_technology7"),
      paras: [t("AboutUsPage_technology8")],
    },
    {
      number: "5.",
      head: t("AboutUsPage_how9"),
      paras: [],
      list: [
        {
          text: t("AboutUsPage_how10"),
          subList: [],
        },
        {
          text: t("AboutUsPage_how11"),
          subList: [],
        },
        {
          text: t("AboutUsPage_how12"),
          subList: [],
        },
        {
          text: t("AboutUsPage_how13"),
          subList: [],
        },
      ],
    },
    {
      number: "6.",
      head: t("AboutUsPage_commitment14"),
      paras: [t("AboutUsPage_commitment15")],
    },
    {
      number: "7.",
      head: t("AboutUsPage_join16"),
      paras: [t("AboutUsPage_join17")],
    },
  ];

  return (
    <div>
      <div className="relative w-screen h-[400px]">
        <Image
          alt="about-us-image"
          src="https://images.deliveryhero.io/image/foodpanda/cms-hero.jpg?width=2000&height=500"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
            {t("AboutUsPage_title")}
          </h1>
        </div>
      </div>

      <div className="w-[90%] mx-auto">
        {AboutUsData.map((item) => (
          <OnePara Para={item} key={item.head} />
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
