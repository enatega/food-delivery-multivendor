"use client";

import React from "react";
import { Button } from "primereact/button";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import { useTranslations } from "next-intl";

interface ClearCartModalProps {
  isVisible: boolean;
  onHide: () => void;
  onConfirm: () => void;
}

export default function ClearCartModal({
  isVisible,
  onHide,
  onConfirm,
}: ClearCartModalProps) {

  const t = useTranslations()
  return (
    <CustomDialog
      visible={isVisible}
      onHide={onHide}
      width="450px"
      height="auto"
      className="clear-cart-modal"
    >
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {t('are_you_sure_label')}
          </h2>
          <p className="text-gray-600">
            {t('clear_cart_warning_message')}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            className="bg-green-500 text-white border-none py-2 px-4 rounded-full font-medium"
            onClick={onConfirm}
            label={t('ok_label')}
          />
          <Button
            className="bg-transparent text-gray-700 border border-gray-300 py-2 px-4 rounded-full font-medium"
            onClick={onHide}
            label={t("cancel_label")}
          />
        </div>
      </div>
    </CustomDialog>
  );
}