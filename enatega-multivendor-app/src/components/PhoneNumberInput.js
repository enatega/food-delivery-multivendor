import React, { useRef, useEffect } from 'react';
import { TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  getNationalDigits,
  formatPhoneNumber,
  isValidPhoneNumber,
  getPhoneExample
} from '../utils/phone';

const PhoneNumberInput = ({
  setError,
  placeholder,
  placeholderTextColor,
  style,
  region, // ISO country code, e.g. 'PK' — drives country-specific format & validation
  countryCode, // calling code digits, e.g. '92'
  value,
  onChange
}) => {
  const { t } = useTranslation();
  const debounceRef = useRef(null);

  // Clear the pending validation on unmount.
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const handleChange = (text) => {
    let digits = getNationalDigits(text);

    // Drop the country calling code if the user typed/pasted it in.
    const cc = (countryCode || '').replace('+', '');
    if (cc && digits.startsWith(cc) && digits.length > cc.length) {
      digits = digits.slice(cc.length);
    }

    onChange(digits);

    // Hide any error while typing; only validate once the user pauses.
    setError('');
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (digits && region && !isValidPhoneNumber(digits, region)) {
        const example = getPhoneExample(region);
        setError(example ? t('mobileErrFormat', { example }) : t('mobileErr2'));
      }
    }, 700);
  };

  return (
    <TextInput
      style={style}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      keyboardType="phone-pad"
      value={formatPhoneNumber(value, region)}
      onChangeText={handleChange}
      maxLength={20}
    />
  );
};

export default PhoneNumberInput;
