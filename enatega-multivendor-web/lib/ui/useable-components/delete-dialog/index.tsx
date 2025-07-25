// Prime React
import { Dialog } from "primereact/dialog";

// Components
import CustomButton from "../button";

// Interface and Types
import { IDialogComponentProps } from "@/lib/utils/interfaces/";

const CustomDialog = ({
  title = "Confirm Deletion",
  message,
  visible,
  onHide,
  onConfirm,
  loading,
  buttonConfig,
}: IDialogComponentProps) => {
  const {
    primaryButtonProp: {
      label: primaryButtonLabel = "Confirm",
      icon: primaryButtonIcon = "pi pi-check",
      textColor: primaryButtonTextColor = "text-white",
      bgColor: primaryButtonBGColor = "bg-red-500",
    } = {},
    secondaryButtonProp: {
      label: secondaryButtonLabel = "Cancel",
      icon: secondaryButtonIcon = "pi pi-times",
      textColor: secondaryButtonTextColor = "text-black",
      bgColor: secondaryButtonBGColor = "bg-transparent",
    } = {},
  } = buttonConfig || {};

  const footer = (
    <div className="flex space-x-2 text-center justify-center">
      <CustomButton
        label={secondaryButtonLabel || "Cancel"}
        icon={secondaryButtonIcon || "pi pi-times"}
        onClick={onHide}
        className={`h-9 rounded border border-gray-300 px-5 ${secondaryButtonBGColor} ${secondaryButtonTextColor}`}
      />
      <CustomButton
        loading={loading}
        label={primaryButtonLabel || "Confirm"}
        className={`h-9 rounded border-gray-300 px-4 ${primaryButtonBGColor} ${primaryButtonTextColor}`}
        icon={primaryButtonIcon || "pi pi-check"}
        onClick={onConfirm}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: "32rem", textAlign: "center" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={title}
      modal
      footer={footer}
      onHide={onHide}
    >
      <div className="confirmation-content text-center mx-3 text-sm sm:text-lg">
        <span>{message || "Are you sure you want to delete this item?"}</span>
      </div>
    </Dialog>
  );
};

export default CustomDialog;
