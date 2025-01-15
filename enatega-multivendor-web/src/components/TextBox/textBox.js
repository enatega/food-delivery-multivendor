import React from 'react';
import useStyles from './style';

const TextBox = ({ placeholder, value, onChange, name, className, required }) => {
  const classes = useStyles();
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required= {required}
      className={`${classes.textBox} ${className}`} // Apply the styles
    />
  );
};

export default TextBox;
