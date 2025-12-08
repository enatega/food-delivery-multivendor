'use client';

// Interface and Types
import { INumberTextFieldProps } from '@/lib/utils/interfaces';

// Hooks
import { useFormikContext } from 'formik';

// Components
import { InputNumber } from 'primereact/inputnumber';
import InputSkeleton from '../custom-skeletons/inputfield.skeleton';

// Styles
import classes from './custom-input.module.css';

export default function CustomNumberTextField({
  className,
  placeholder,
  name,
  value,
  isLoading = false,
  onChange,
  ...props
}: INumberTextFieldProps) {
  // Formik
  const { setFieldValue } = useFormikContext();

  const MIN_VALUE = 1;
  const MAX_VALUE = 100;

  const handleIncrease = () => {
    const currentValue = value || 0;
    if (currentValue < MAX_VALUE) {
      setFieldValue(name, currentValue + 1);
    }
  };

  const handleDecrease = () => {
    const currentValue = value || 0;
    if (currentValue > MIN_VALUE) {
      setFieldValue(name, currentValue - 1);
    }
  };

  return !isLoading ? (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-600 dark:text-white">
        {placeholder}
      </label>

      <div className="relative flex items-center justify-between">
        {/* Decrease */}
        <div
          className="absolute left-2 z-10 flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full border border-[#E4E4E7] hover:bg-slate-200"
          onClick={handleDecrease}
        >
          <span className="text-gray-500 dark:text-white">-</span>
        </div>

        <InputNumber
          className={`${classes.inputNumber} z-0 h-11 w-full border border-inherit bg-white dark:bg-dark-950 px-10 text-center focus:shadow-none focus:outline-none ${className}`}
          name={name}
          value={value}
          prefix="$ "
          useGrouping={false}
          onChange={(e: { value: number | null }) => {
            setFieldValue(name, e.value);
            onChange?.(name, e.value); // Safely call onChange if defined
          }}
          {...props}
        />

        {/* Increase */}
        <div
          className="absolute right-2 z-10 flex h-6 w-6 cursor-pointer select-none items-center justify-center rounded-full border border-[#E4E4E7] hover:bg-slate-200"
          onClick={handleIncrease}
        >
          <span className="text-gray-500 dark:text-white">+</span>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <InputSkeleton />
    </div>
  );
}
