"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// ANimation
// import notFoundAnimation from "@/lib/assets/animations/404.json"; // You can place your JSON file in public or src/assets
import animationData from "@/lib/assets/animations/404.json"; // Your Lottie file
import CustomLoader from "@/lib/ui/useable-components/custom-progress-indicator";

const COUNTER = 5;

export default function NotFound() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(COUNTER);

  useEffect(() => {
    if (timeLeft === 0) {
      router.replace("/");
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full bg-transparent flex flex-col justify-center items-center">
        <div className="h-[500px] w-[500px]">
          <Lottie animationData={animationData} loop />
        </div>
        <div className="flex gap-x-3">
          <CustomLoader />
          <span className="text-lg font-semibold text-gray-700 animate-pulse">
            Redirecting in {timeLeft}
          </span>
        </div>
      </div>
    </div>
  );
}
