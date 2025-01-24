import React from 'react';
import useStyles from './style';

const DoubleTextFieldRow = ({ placeholder1, name1, value1, onChange, placeholder2, name2, value2, required }) => {
  const classes = useStyles();

  const handleValidationChange = (event) => {
    const { value } = event.target;
    const regex = /^[A-Za-z]*$/; // Allows only alphabetic characters
    if (regex.test(value) || value === "") {
      onChange(event); // Call the parent onChange handler only if valid
    }
  };

  return (
    <div className={classes.textFieldRow}>
      <input
        type="text"
        placeholder={placeholder1}
        name={name1}
        value={value1}
        onChange={handleValidationChange}
        className={classes.textField}
        required={required}
      />
      <input
        type="text"
        placeholder={placeholder2}
        name={name2}
        value={value2}
        onChange={handleValidationChange}
        className={classes.textField}
        required={required}
      />
    </div>
  );
};

export default DoubleTextFieldRow;
