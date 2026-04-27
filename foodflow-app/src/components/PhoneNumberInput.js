import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const PhoneNumberInput = ({
    setError,
    placeholder,
    placeholderTextColor,
    style,
    countryCode,
    value,
    onChange,
    
}) => {
    

    const cleanNumber = (input) => {
        return input.replace(/[^\d+]/g, '');
    };

    const handleChange = (text) => {
        let input = cleanNumber(text);


        const countryCodeDigits = countryCode.replace('+', '');
        if (input.startsWith('+' + countryCodeDigits)) {
            input = input.replace('+' + countryCodeDigits, '');
        } else if (input.startsWith(countryCodeDigits)) {
            input = input.replace(countryCodeDigits, '');
        }


        input = input.replace(/\s+/g, '');

        // Uncomment if you want to remove leading zero
        // if (input.startsWith('0')) {
        //     input = input.substring(1);
        // }


        if (!/^\d*$/.test(input)) {
            setError('This number doesn’t seem right. Try again.');
        } else {
            setError('');
        }

        onChange(input);
    };

    return (
      
             <TextInput
              style={style}
              placeholder={placeholder}
              placeholderTextColor={placeholderTextColor}
              keyboardType="phone-pad"
              value={value}
              onChangeText={handleChange}
              maxLength={15}
            />
       
    );
};



export default PhoneNumberInput;
