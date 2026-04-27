"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/lib/utils/interfaces/footer.interface";

const FooterLinkItem: React.FC<Link> = ({ label, link, internal }) => {
  const router = useRouter();

  function navigate() {
    if (internal) {
      router.push(link);
    } else {
      window.open(link, "_blank");
    }
  }

  return (
    <li className="text-md text-white hover:underline cursor-pointer">
      <button onClick={navigate}>{label}</button>
    </li>
  );
};

export default FooterLinkItem;
