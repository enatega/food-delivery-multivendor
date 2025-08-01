// Prime React
import { Dialog } from "primereact/dialog";

// Components
import CustomButton from "../button";

// Interface and Types
import { IDialogComponentProps } from "@/lib/utils/interfaces/";
import { useTranslations } from "next-intl";

const CustomDialog = ({
  title,
  message,
  visible,
  onHide,
  onConfirm,
  loading,
  buttonConfig,
}: IDialogComponentProps) => {
  const t = useTranslations();

  const {
    primaryButtonProp: {
      label: primaryButtonLabel = t("confirm"),
      icon: primaryButtonIcon = "pi pi-check",
      textColor: primaryButtonTextColor = "text-white",
      bgColor: primaryButtonBGColor = "bg-red-500",
    } = {},
    secondaryButtonProp: {
      label: secondaryButtonLabel = t("cancel_label"),
      icon: secondaryButtonIcon = "pi pi-times",
      textColor: secondaryButtonTextColor = "text-black",
      bgColor: secondaryButtonBGColor = "bg-transparent",
    } = {},
  } = buttonConfig || {};

  const footer = (
    <div className="flex space-x-2 text-center justify-center">
      <CustomButton
        label={secondaryButtonLabel}
        icon={secondaryButtonIcon}
        onClick={onHide}
        className={`h-9 rounded border border-gray-300 px-5 ${secondaryButtonBGColor} ${secondaryButtonTextColor}`}
      />
      <CustomButton
        loading={loading}
        label={primaryButtonLabel}
        className={`h-9 rounded border-gray-300 px-4 ${primaryButtonBGColor} ${primaryButtonTextColor}`}
        icon={primaryButtonIcon}
        onClick={onConfirm}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: "32rem", textAlign: "center" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={title || t("confirm_deletion")}
      modal
      footer={footer}
      onHide={onHide}
    >
      <div className="confirmation-content text-center mx-3 text-sm sm:text-lg">
        <span>{message || t("confirm_delete")}</span>
      </div>
    </Dialog>
  );
};

export default CustomDialog;
