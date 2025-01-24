import React, { useState } from 'react';
import useStyles from './style';
import TaEye from '../../assets/images/TaEye.png'
import TaEyeSlash from '../../assets/images/TaEyeSlash.png'
const SingleTextField = ({ placeholder, value, onChange, name, isPassword, required }) => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className={classes.textFieldContainer}>
      <input
        type={isPassword && !showPassword ? 'password' : 'text'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className={classes.textField}
        required = {required}
      />
      {isPassword && (
        <button type="button" onClick={handleTogglePassword} className={classes.toggleButton}>
          {showPassword ?  <img src ={TaEye} size={20} alt='eye'/> : <img src ={TaEyeSlash} size={20} alt='eye'/>}
        </button>
      )}
    </div>
  );
};

export default SingleTextField;
