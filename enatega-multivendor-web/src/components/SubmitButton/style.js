import { makeStyles } from '@mui/styles';

const useButtonStyles = makeStyles((theme) => ({
  button: {
    width: '100%',
    height: '43px', // Match text field height
    borderRadius: '10px', // Match text field border radius
    border: '1px solid #B0B0B0', // Match text field border
    boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)', // Match text field box shadow
    padding: '0 12px', // Match text field padding
    fontFamily: 'Poppins, sans-serif',
    fontSize: '20px', // Match text field font size
    fontWeight: '500',
    lineHeight: '22px',
    textAlign: 'center',
    background: '#333333', // Black background
    color: '#AAC810', // Button text color
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '16px', // Match text field margin
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background 0.3s ease',
    '&:hover': {
      background: '#222222', // Darker shade on hover
    },
    '&:disabled': {
      opacity: 0.7, // Slightly transparent when disabled
      cursor: 'not-allowed',
      background: '#333333',
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
    },
  },
}));

export default useButtonStyles;
