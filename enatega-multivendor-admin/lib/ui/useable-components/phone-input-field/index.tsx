'use client';

// Interfaces
import { IPhoneTextFieldProps } from '@/lib/utils/interfaces';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

// Hooks
import { useState } from 'react';

// Components & Skeletons
import InputSkeleton from '../custom-skeletons/inputfield.skeleton';

export default function CustomPhoneTextField({
  className,
  style,
  showLabel,
  placeholder = '',
  isLoading = false,
  value,
  // mask,
  page,
  onChange,
}: IPhoneTextFieldProps) {
  // Transformed Country Codes
  // const transformedCountryCodes: IDropdownSelectItem[] =
  //   transformCountryCodes(CountryCodes);

  // States
  // const [selectedCountryCode, setSelectedCountryCode] =
  //   useState<IDropdownSelectItem>();
  const [, setPhone] = useState('');

  const handlePhoneInputChange = (phone: string) => {
    setPhone(phone);
    onChange?.(phone);
  };

  const inputStyle =
    page === 'vendor-profile-edit' ? { width: '100%' } : { width: '100%' };

  const MaininputStyle =
    page === 'vendor-profile-edit'
      ? { width: '100%', borderRadius: '0 5px 5px 0', height: '40px' }
      : { width: '100%', borderRadius: '0 5px 5px 0', height: '40px' };

  return !isLoading ? (
    <div className="relative flex w-full flex-col justify-center gap-y-1">
      {showLabel && (
        <label htmlFor="phone" className="text-sm font-[500]">
          {placeholder}
        </label>
      )}
      <div style={style} className={`flex items-center ${className}`}>
        <PhoneInput
          defaultCountry="au"
          value={value ?? ''}
          onChange={handlePhoneInputChange}
          style={inputStyle}
          inputStyle={MaininputStyle}
        />
      </div>
    </div>
  ) : (
    <InputSkeleton />
  );
}
