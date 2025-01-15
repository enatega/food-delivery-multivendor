import React from 'react';
import useButtonStyles from './style';
import { PropagateLoader } from 'react-spinners';

const SubmitButton = ({ label, onClick, type, loading }) => {
  const classes = useButtonStyles();

  return (
    <button
      type={type}
      className={classes.button}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <PropagateLoader color="#ffffff" size={8} margin={2} />
      ) : (
        label
      )}
    </button>
  );
};

export default SubmitButton;
