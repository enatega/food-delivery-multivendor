"use client";

import React from "react";
import { buttonProps } from "@/lib/utils/interfaces/Home-interfaces";
import { useRouter } from "next/navigation";

const TranparentButton: React.FC<buttonProps> = ({ text, link }) => {
  const router = useRouter();

  function navigate() {
    link ? router.push(link, {
      scroll: true
    }) : undefined;
  }
  return (
    <button
      onClick={navigate}
      className="p-3 bg-black/30 rounded-3xl w-[180px] shadow-[#94e469] shadow-sm backdrop-blur-sm hover:bg-black/55 h-[50px] flex gap-2 items-center justify-center"
    >
      <p className="text-white text-[16px]"> {text}</p>
      <i
        className="pi pi-angle-right"
        style={{ fontSize: "1rem", color: "white" }}
      ></i>
    </button>
  );
};

export default TranparentButton;
