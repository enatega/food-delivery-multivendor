'use client';

// Interface and Types
import { ICustomRadiusInputFieldComponentProps } from '@/lib/utils/interfaces';


// Components
import { InputText } from 'primereact/inputtext';

// Styles
import InputSkeleton from '../custom-skeletons/inputfield.skeleton';
import classes from './cusom-input.module.css';

export default function CustomRadiusInputField({
  className,
  placeholder,
  name,
  value,
  loading = false,
  showLabel,
  onChange,
  ...props
}: ICustomRadiusInputFieldComponentProps) {
  const MIN_VALUE = 1;
  // const MAX_VALUE = 100;

  const handleIncrease = () => {
    const currentValue = value || 0;
    // if (currentValue < MAX_VALUE) {
      onChange && onChange(currentValue + 1);
    // }
  };

  const handleDecrease = () => {
    const currentValue = value || 0;
    if (currentValue > MIN_VALUE) {
      onChange && onChange(currentValue - 1);
    }
  };

  return !loading ? (
    <div className="flex flex-col gap-2">
      {showLabel && (
        <label htmlFor={name} className="text-sm font-medium text-gray-600">
          {placeholder}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Decrease */}
        <div
          className="absolute left-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] hover:bg-slate-200"
          onClick={handleDecrease}
        >
          <span className="text-gray-500">-</span>
        </div>

        <InputText
          className={`${classes.numberInput} h-11 w-full border border-inherit px-8 text-center focus:shadow-none focus:outline-none ${className}`}
          name={name}
          value={value.toString()}
          {...props}
          onChange={(e) => {
            onChange && onChange(+e.target.value);
          }}
        />

        {/* Increase */}
        <div
          className="absolute right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] hover:bg-slate-200"
          onClick={handleIncrease}
        >
          <span className="text-gray-500">+</span>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <InputSkeleton />
    </div>
  );
}
