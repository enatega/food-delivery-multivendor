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
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange({
        target: { name, value: newValue },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-600 ">
        {placeholder}
      </label>

      <div className="relative flex items-center">
        <InputText
          className={`${classes.numberInput} h-11 w-full border border-inherit px-3 pe-9 text-center focus:shadow-none focus:outline-none ${className}`}
          name={name}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          {...props}
        />

        <span className="pointer-events-none absolute right-3 font-semibold text-gray-500 dark:text-gray-300">%</span>
      </div>
    </div>
  );
}
