// Core
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

// Prime React
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

// Icons
import { faEye } from '@fortawesome/free-solid-svg-icons';

// Interfaces
import { IPasswordTextFieldProps } from '@/lib/utils/interfaces';

// Prime React

// Styles

export default function CustomPasswordTextField({
  className,
  //  iconProperties: { icon, position },
  placeholder,
  showLabel,
  ...props
}: IPasswordTextFieldProps) {
  // States
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const _icon = faEye;

  return (
    <IconField iconPosition={'left'}>
      <InputIcon
        className="cursor-pointer"
        onClick={() => setIsVisible((prevState) => !prevState)}
      >
        <FontAwesomeIcon icon={_icon} className="mt-3 cursor-pointer" />
      </InputIcon>

      <div className="flex flex-col gap-y-1">
        {showLabel && (
          <label htmlFor="username" className="text-sm font-[500]">
            {placeholder}
          </label>
        )}
        <InputText
          type={isVisible ? 'text' : 'password'}
          className={`h-10 w-full border border-gray-300 border-inherit px-0 text-sm focus:shadow-none focus:outline-none ${className}`}
          placeholder={placeholder}
          {...props}
        />
      </div>
    </IconField>
  );
}
