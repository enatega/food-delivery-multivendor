import React from 'react';
import { InputText } from 'primereact/inputtext';

interface CustomTextInputProps extends React.ComponentPropsWithoutRef<'input'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  ...props
}) => {
  return (
    <InputText
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`p-inputtext p-component ${className}`}
      {...props}
    />
  );
};

export default CustomTextInput;