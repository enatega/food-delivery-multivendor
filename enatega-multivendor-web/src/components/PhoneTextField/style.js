import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  phoneInput: {
    width: '100%',
    maxWidth: '500px',
    height: '42px',
    borderRadius: '10px', // Square-like shape with rounded corners
    border: '1px solid #E3E3E3', // Thin border
    padding: '0 15px',
    fontFamily: 'Poppins',
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '24px',
    textAlign: 'left',
    background: '#fffff',
    color: '#B0B0B0',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '20px',
    '&::placeholder': {
      fontFamily: 'Poppins',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
      textAlign: 'left',
      color: '#E3E3E3',
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: '16px',
      height: '38px',
      '&::placeholder': {
        fontSize: '16px',
      },
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '15px',
      height: '36px',
      '&::placeholder': {
        fontSize: '15px',
      },
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px',
      height: '34px',
      '&::placeholder': {
        fontSize: '14px',
      },
    },
  },
}));

export default useStyles;
