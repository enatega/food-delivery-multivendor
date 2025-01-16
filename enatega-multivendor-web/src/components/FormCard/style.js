import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    height: 'auto',
    width: '100%',
    maxWidth: '567px',
    borderRadius: '12px',
    backgroundColor: '#ffffff', 
    boxShadow: '0px 0px 4px #00000052',
    position: 'relative',
    margin: '0 auto', 
    zIndex: 1,
    boxSizing: 'border-box',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
      borderRadius: '12px',
    },
  },
  descriptionBox: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  description: {
    fontSize: '15px',
    fontWeight: '400',
    color: '#787878',
  },
  heading: {
    color: '#000000', // Black color for the heading
    textAlign: 'left', // Align the heading to the left
    marginBottom: '15px', // Add some space below the heading
    marginLeft: '15px',
    fontSize: '32px', // Adjust the font size as needed
    fontWeight: '500', // Make the heading bold
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0',
      fontSize: '16px'
    }
  },
  formContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // padding: '10px',

    '& > *': {
      width: '100%',
      maxWidth: '500px',
      marginBottom: '10px',
    },
  },
}));

export default useStyles;
