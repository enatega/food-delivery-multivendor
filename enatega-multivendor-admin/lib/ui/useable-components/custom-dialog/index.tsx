import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

interface ButtonConfig {
  label: string;
  icon?: string;
  className?: string;
}

interface CustomDialogProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  loading: boolean;
  buttonConfig: {
    primaryButtonProp: ButtonConfig;
    secondaryButtonProp: ButtonConfig;
  };
  children?: React.ReactNode;
}

export const CustomDialog: React.FC<CustomDialogProps> = ({
  visible,
  onHide,
  onConfirm,
  title,
  message,
  loading,
  buttonConfig,
  children,
}) => {
  const footer = (
    <div>
      <Button
        label={buttonConfig.secondaryButtonProp.label}
        icon={buttonConfig.secondaryButtonProp.icon}
        onClick={onHide}
        className={`p-button-text ${buttonConfig.secondaryButtonProp.className || ''}`}
      />
      <Button
        label={buttonConfig.primaryButtonProp.label}
        icon={buttonConfig.primaryButtonProp.icon}
        onClick={onConfirm}
        loading={loading}
        className={buttonConfig.primaryButtonProp.className}
        autoFocus
      />
    </div>
  );

  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: '50vw', maxWidth: '600px' }}
      onHide={onHide}
      footer={footer}
      modal
      draggable={false}
    >
      {message && <p>{message}</p>}
      {children}
    </Dialog>
  );
};
