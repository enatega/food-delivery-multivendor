// Core
import { CustomContinueButton } from "@/lib/ui/useable-components";

// Hooks
import { useTranslation } from "react-i18next";

export default function UpdateScheduleBtn({
  onHandlerSubmit,
  isUpatingSchedule,
}: {
  onHandlerSubmit: () => Promise<void>;
  isUpatingSchedule: boolean;
  width: number;
}) {
  // Hooks
  const { t } = useTranslation();

  return (
    <CustomContinueButton
      title={t("Update Schedule")}
      onPress={onHandlerSubmit}
      isLoading={isUpatingSchedule}
    />
  );
}
