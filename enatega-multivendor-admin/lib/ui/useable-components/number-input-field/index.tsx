// Interfaces
import { INumberTextFieldProps } from '@/lib/utils/interfaces';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import InputSkeleton from '../custom-skeletons/inputfield.skeleton';

// Prime React

export default function CustomNumberField({
  className,
  placeholder,
  name,
  showLabel,
  onChange,
  onChangeFieldValue,
  isLoading = false,
  disabled = false,
  ...props
}: INumberTextFieldProps) {
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
        onKeyDown={(e) => {
          if (
            props.max !== undefined &&
            Number(e.currentTarget.value ?? 0) > props.max
          ) {
            e.preventDefault();
          }
        }}
        onChange={(e: InputNumberChangeEvent) => {
          if (props.max !== undefined && Number(e.value ?? 0) > props.max) {
            return;
          }
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
