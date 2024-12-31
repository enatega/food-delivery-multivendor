'use client';

import { ICustomNumberTippingProps } from '@/lib/utils/interfaces';
import { InputText } from 'primereact/inputtext';
import classes from './custom-commission-input.module.css';

export default function CustomCommissionTextField({
  className,
  placeholder,
  name,
  value,
  onChange,
  ...props
}: ICustomNumberTippingProps) {
  const MIN_VALUE = 0;
  const MAX_VALUE = 100;

  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange({
        target: { name, value: newValue },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleIncrease = () => {
    const currentValue = parseFloat(value as string);
    if (isNaN(currentValue)) {
      handleChange(MIN_VALUE.toString());
    } else if (currentValue < MAX_VALUE) {
      handleChange((currentValue + 1).toString());
    }
  };

  const handleDecrease = () => {
    const currentValue = parseFloat(value as string);
    if (isNaN(currentValue)) {
      handleChange(MIN_VALUE.toString());
    } else if (currentValue > MIN_VALUE) {
      handleChange((currentValue - 1).toString());
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-600">
        {placeholder}
      </label>

      <div className="relative flex items-center">
        <div
          className="absolute left-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] hover:bg-slate-200"
          onClick={handleDecrease}
        >
          <span className="text-gray-500">-</span>
        </div>

        <InputText
          className={`${classes.numberInput} h-11 w-full border border-inherit px-8 text-center focus:shadow-none focus:outline-none ${className}`}
          name={name}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          {...props}
        />

        <div
          className="absolute right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] hover:bg-slate-200"
          onClick={handleIncrease}
        >
          <span className="text-gray-500">+</span>
        </div>
      </div>
    </div>
  );
}
