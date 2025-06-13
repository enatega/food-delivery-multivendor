"use client";

import React from "react";
import { Button } from "primereact/button";
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";

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
            Are you sure?
          </h2>
          <p className="text-gray-600">
            Your cart contains items from a different restaurant. Adding this
            item will clear your current cart.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            className="bg-green-500 text-white border-none py-2 px-4 rounded-full font-medium"
            onClick={onConfirm}
            label="OK"
          />
          <Button
            className="bg-transparent text-gray-700 border border-gray-300 py-2 px-4 rounded-full font-medium"
            onClick={onHide}
            label="Cancel"
          />
        </div>
      </div>
    </CustomDialog>
  );
}