import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  textFieldContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    // width: '100%',
  },
  textField: {
    width: '100%',
    maxWidth: '500px',
    height: '42px',
    borderRadius: '10px', // Square-like shape with rounded corners
    border: '1px solid #E3E3E3', // Thinner border
    // boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)', // Lighter shadow for subtle depth
    padding: '0 12px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '15px', // Adjusted for responsiveness
    fontWeight: '400',
    lineHeight: '22px',
    backgroundColor: '#fffff',
    color: '#333333',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '16px',
    '&::placeholder': {
      fontFamily: 'Poppins, sans-serif',
      fontSize: '15px', // Match text size for consistency
      fontWeight: '400', // Thinner placeholder text
      color: '#B1B1B1', // Lighter color for placeholder
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: '15px',
      height: '42px',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
      height: '40px',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '13px',
      height: '38px',
      borderRadius: '6px',
      padding: '0 10px',
    marginBottom: '8px',
    },
  },
  toggleButton: {
    position: 'absolute',
    right: '12px',
    top: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666666',
  },
}));

export default useStyles;
