// Interfaces
import { INumberTextFieldProps } from '@/lib/utils/interfaces';

// Prime React
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import InputSkeleton from '../custom-skeletons/inputfield.skeleton';

// Hooks
import useToast from '@/lib/hooks/useToast';

export default function CustomNumberField({
  className,
  placeholder,
  name,
  showLabel,
  onChange,
  onChangeFieldValue,
  isLoading = false,
  disabled = false,
  min,
  max,
  ...props
}: INumberTextFieldProps) {
  // Toast
  const { showToast } = useToast();

  const onNumberChangeHandler = (e: InputNumberChangeEvent) => {
    if (onChange) {
      onChange(name, e.value);
    } else if (onChangeFieldValue) {
      onChangeFieldValue(name, e.value ?? 0);
    } else {
      alert(`Either pass onChange or setFieldValue ${name}`);
    }
  };

  return !isLoading ? (
    <div className={`flex w-full flex-col justify-center gap-y-1`}>
      {showLabel && (
        <label htmlFor="username" className="text-sm font-[500]">
          {placeholder}
        </label>
      )}

      <InputNumber
        className={`h-10 w-full rounded-lg border border-gray-300 bg-gray-300 text-sm focus:shadow-none focus:outline-none ${className}`}
        placeholder={placeholder}
        min={min}
        max={max}
        onKeyDown={(e) => {
          if (max !== undefined && Number(e.currentTarget.value) > max) {
            e.preventDefault();
            return showToast({
              type: 'error',
              title: 'Coupon',
              message:
                'As Discount is a %age field, please choose a value from 0 to 100.',
            });
          }
        }}
        onChange={(e: InputNumberChangeEvent) => {
          onNumberChangeHandler(e);
        }}
        {...props}
        disabled={disabled}
      />
    </div>
  ) : (
    <InputSkeleton />
  );
}
