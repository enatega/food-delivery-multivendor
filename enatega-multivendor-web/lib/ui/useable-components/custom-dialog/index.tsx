"use client";
import { Dialog } from "primereact/dialog";
import { ICustomDialogProps } from "@/lib/utils/interfaces";
import { CircleCrossSvg } from "@/lib/utils/assets/svg";

export default function CustomDialog({
  visible,
  onHide,
  children,
  width = "450px",
  height = "auto",
  showCloseButton = true,
  className = "",
}: ICustomDialogProps) {
     // get the RTL direction
     const direction = document.documentElement.getAttribute('dir') || 'ltr';
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      dismissableMask
      showHeader={false}
      className={`w-full md:m-10 m-2 bg-white ${className} `}
      contentClassName="p-0 rounded-xl scrollbar-none  m-4 md:m-0 dark:bg-gray-900 dark:text-white"
      headerClassName="dark:bg-gray-900 dark:text-white"
      style={{ maxWidth: width, borderRadius: "0.75rem", height: height }}
    >
      <div className="relative">
        {/* Close button */}
        {showCloseButton && (
          <span
            onClick={onHide}
            className={`${direction === "rtl" ? "left-4" : "right-4"} absolute cursor-pointer top-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-700 focus:outline-none`}
          >
            <CircleCrossSvg darkColor="white" color="black" width={24} height={24} />
          </span>
        )}

        {/* Just render the children passed to the dialog */}
        {children}
      </div>
    </Dialog>
  );
}
