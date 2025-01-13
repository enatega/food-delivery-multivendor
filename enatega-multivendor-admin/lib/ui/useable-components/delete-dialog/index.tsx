// Prime React
import { Dialog } from 'primereact/dialog';

// Components
import CustomButton from '../button';

// Interface and Types
import { IDialogComponentProps } from '@/lib/utils/interfaces/dialog.interface';

const CustomDialog = ({
  title = 'Confirm Deletion',
  message,
  visible,
  onHide,
  onConfirm,
  loading,
  buttonConfig,
}: IDialogComponentProps) => {
  const {
    primaryButtonProp: {
      label: primaryButtonLabel = 'Confirm',
      icon: primaryButtonIcon = 'pi pi-check',
      textColor: primaryButtonTextColor = 'text-white',
      bgColor: primaryButtonBGColor = 'bg-red-500',
    } = {},
    secondaryButtonProp: {
      label: secondaryButtonLabel = 'Cancel',
      icon: secondaryButtonIcon = 'pi pi-times',
      textColor: secondaryButtonTextColor = 'text-black',
      bgColor: secondaryButtonBGColor = 'bg-transparent',
    } = {},
  } = buttonConfig || {};

  const footer = (
    <div className="space-x-2">
      <CustomButton
        label={secondaryButtonLabel || 'Cancel'}
        icon={secondaryButtonIcon || 'pi pi-times'}
        onClick={onHide}
        className={`h-9 rounded border border-gray-300 px-5 ${secondaryButtonBGColor} ${secondaryButtonTextColor}`}
      />
      <CustomButton
        loading={loading}
        label={primaryButtonLabel || 'Confirm'}
        className={`h-9 rounded border-gray-300 px-4 ${primaryButtonBGColor} ${primaryButtonTextColor}`}
        icon={primaryButtonIcon || 'pi pi-check'}
        onClick={onConfirm}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: '32rem' }}
      breakpoints={{ '960px': '75vw', '641px': '90vw' }}
      header={title}
      modal
      footer={footer}
      onHide={onHide}
    >
      <div className="confirmation-content">
        <span>{message || 'Are you sure you want to delete this item?'}</span>
      </div>
    </Dialog>
  );
};

export default CustomDialog;
