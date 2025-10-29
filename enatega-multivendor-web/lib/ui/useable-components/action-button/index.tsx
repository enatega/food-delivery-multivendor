import { IActionButtonProps } from "@/lib/utils/interfaces";
import { Button } from "primereact/button";
import { twMerge } from "tailwind-merge";


const ActionButton = ({
  onClick,
  disabled = false,
  primary = false,
  children,
}: IActionButtonProps) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className={twMerge(
      "w-full py-3 rounded-full text-center font-medium transition-colors justify-center",
      primary
        ? "bg-[#5AC12F] text-white font-medium transition-colors"
        : disabled
          ? "bg-gray-100 dark:bg-gray-600 dark:text-gray-400 text-gray-400 cursor-not-allowed"
          : "bg-[#5AC12F]  hover:bg-[#5ab633]  text-gray-800"
    )}
  >
    {children}
  </Button>
);

export default ActionButton;
