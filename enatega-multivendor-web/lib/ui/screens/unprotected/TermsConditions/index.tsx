import React from "react";
import Image from "next/image";
import OnePara from "@/lib/ui/screen-components/un-protected/TermsConditions/OnePara";
import { useTranslations } from "next-intl";
const TermsConditions = () => {
  const t = useTranslations()
  const ParasData = [
    {
      number: "1.",
      head: t("terms_of_use"),
      paras: [
        t("terms_paragraph_1_1")
      ],
    },
    {
      number: "2.",
      head: t("use_of_platforms_and_account"),
      paras: [
        t("terms_paragraph_2_1")
      ],
    },
    {
      number: "3.",
      head: t("intellectual_property"),
      paras: [
        t("terms_paragraph_3_1"),
      ],
    },
    {
      number: "4. ",
      head: t("vendor_liability"),
      paras: [
        t("terms_paragraph_4_1")
      ],
    },
    {
      number: "5.",
      head: t("personal_data_protection"),
      paras: [
        t("terms_paragraph_5_1")
      ],
    },
    {
      number: "6.",
      head: t("indemnity"),
      paras: [
        t("terms_paragraph_6_1")
      ],
    },
    {
      number: "7.",
      head: t("third_party_links_and_websites"),
      paras: [
        t("terms_paragraph_7_1")
      ],
    },
    {
      number: "8.",
      head: t("termination"),
      paras: [
        t("terms_paragraph_8_1")
      ],
    },
    {
      number: "9.",
      head: t("amendments"),
      paras: [
        t("terms_paragraph_9_1")
      ],
    },
    {
      number: "10.",
      head: t("severability"),
      paras: [
        t("terms_paragraph_10_1")
      ],
    },
    {
      number: "11.",
      head: t("governing_law"),
      paras: [
        t("terms_paragraph_11_1")
      ],
    },
    {
      number: "12.",
      head: t("contact_us"),
      paras: [
        t("terms_paragraph_12_1")
      ],
    },
    {
      number: "13.",
      head: t("prevailing_language"),
      paras: [
        t("terms_paragraph_13_1")
      ],
    },
  ];
  const ListDatas = [
    {
      number: "14.",
      head: t("restrictions"),
      paras: [],
      list: [
        {
          text: t("list_14_1"),
          subList: [],
        },
        {
          text: t("list_14_2"),
          subList: [],
        },
      ],
    },
    {
      number: "15.",
      head: t("yalla"),
      paras: [
        t("list_15_1")
      ],
      list: [
        {
          text: t("list_15_1_item_1"),
          subList: [],
        },
        {
          text: t("list_15_1_item_2"),
          subList: [],
        },
        {
          text: t("list_15_1_item_3"),
          subList: [],
        },
        {
          text: t("list_15_1_item_4"),
          subList: [],
        },
        {
          text: t("list_15_1_item_5"),
          subList: [],
        },
        {
          text: t("list_15_1_item_6"),
          subList: [],
        },
        {
          text: t("list_15_1_item_7"),
          subList: [],
        },
        {
          text: t("list_15_1_item_8"),
          subList: [],
        },
        {
          text: t("list_15_1_item_9"),
          subList: [],
        },
        {
          text: t("list_15_1_item_10"),
          subList: [],
        },
        {
          text: t("list_15_1_item_11"),
          subList: [],
        },
        {
          text: t("list_15_1_item_12"),
          subList: [],
        },
        {
          text: t("list_15_1_item_13"),
          subList: [],
        },
        {
          text: t("list_15_1_item_14"),
          subList: [],
        },
        {
          text: t("list_15_1_item_15"),
          subList: [],
        },
        {
          text: t("list_15_1_item_16"),
          subList: [],
        },
        {
          text: t("list_15_1_item_17"),
          subList: [],
        },
        {
          text: t("list_15_1_item_18"),
          subList: [],
        },
      ],
    },
    {
      number: "16.",
      head: t("restrictions_on_goods"),
      paras: [""],
      list: [
        {
          text: t("list_16_1"),
          subList: [],
        },
        {
          text: t("list_16_1_item_1"),
          subList: [],
        },
        {
          text: t("list_16_1_item_2"),
          subList: [],
        },
        {
          text: t("list_16_1_item_3"),
          subList: [],
        },
        { text: t("list_16_1_item_4"), subList: [] },
        {
          text: t("list_16_1_item_5"),
          subList: [],
        },
        {
          text: t("list_16_1_item_6"),
          subList: [
            t("list_16_1_item_6_sub_1"),
            t("list_16_1_item_6_sub_2"),
          ],
        },
        {
          text: t("list_16_1_item_7"),
          subList: [],
        },
      ],
    },
    {
      number: "17.",
      head: t("orders"),
      paras: [""],
      list: [
        {
          text: t("list_17_1"),
          subList: [],
        },
        {
          text: t("list_17_1_item_1"),
          subList: [],
        },
        {
          text: t("list_17_1_item_2"),
          subList: [],
        },
        {
          text: t("list_17_1_item_3"),
          subList: [],
        },
        {
          text: t("list_17_1_item_4"),
          subList: [],
        },
      ],
    },
    {
      number: "18.",
      head: t("prices_and_payments"),
      paras: [
        t("list_18_1"),
        t("list_18_2"),
        t("list_18_3"),
        t("list_18_4"),
      ],
      list: [
        { text: t("list_18_1_item_1") },
        { text: t("list_18_1_item_2") },
        { text: t("list_18_1_item_3") },
        {
          text: t("list_18_1_item_4"),
        },
        {
          text: t("list_18_1_item_5"),
        },
        {
          text: t("list_18_1_item_6"),
        },
        {
          text: t("list_18_1_item_7"),
        },
        { text: t("list_18_1_item_8") },
        { text: t("list_18_1_item_9") },
        {
          text: t("list_18_1_item_10"),
        },
      ],
    },
    {
      number: "19.",
      head: t("delivery_pickup_vendor_delivery"),
      paras: [
        t("list_19_1"),
        t("list_19_2"),
        t("list_19_3"),
        t("list_19_4"),
        t("list_19_5"),
      ],
      list: [
        { text: t("list_19_1_item_1") },
        { text: t("list_19_1_item_2") },
        { text: t("list_19_1_item_3") },
        { text: t("list_19_1_item_4") },
        { text: t("list_19_1_item_5") },
        { text: t("list_19_1_item_6") },
        { text: t("list_19_1_item_7") },
        { text: t("list_19_1_item_8") },
        { text: t("list_19_1_item_9") },
        { text: t("list_19_1_item_10") },
        { text: t("list_19_1_item_11") },
        { text: t("list_19_1_item_12") },
      ]
    },
    {
      number: "20.",
      head: t("vouchers_discounts_promotions"),
      paras: [
        t("list_20_1"),
      ],
      list: [
        {
          text: t("list_20_1_item_1"),
        },
        { text: t("list_20_1_item_2") },
        { text: t("list_20_1_item_3") },
        { text: t("list_20_1_item_4") },
        { text: t("list_20_1_item_5") },
      ],
    },
    {
      number: "20.",
      head: t("representations_warranties_limitations"),
      paras: [
        t("terms_paragraph_20_1"),
        t("terms_paragraph_20_2"),
        t("terms_paragraph_20_3")
      ],
      list: [],
    },
  ];
  return (
    <div>
      <div className="relative w-screen h-[400px]">
        <Image
          alt="image"
          src="https://images.deliveryhero.io/image/foodpanda/cms-hero.jpg?width=2000&height=500"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
            {t("yalla_terms_and_conditions")}
          </h1>
        </div>
      </div>
      <div className="w-[90%] mx-auto">
        {ParasData?.map((item) => {
          return <OnePara Para={item} key={item.head} />;
        })}
        {ListDatas?.map((item) => {
          return <OnePara Para={item} key={item.head} />;
        })}
      </div>
    </div>
  );
};
export default TermsConditions;