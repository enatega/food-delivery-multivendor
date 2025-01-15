import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100vh', 
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  leftSide: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '20px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  rightSide: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#AAC810',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  heading: {
    width: '357px',
    height: '74px',
    fontFamily: 'Poppins',
    fontSize: '36px',
    fontWeight: '400',
    marginLeft: '50px',
    lineHeight: '37px',
    letterSpacing: '-0.25px',
    textAlign: 'left',
    color: '#000000',
    [theme.breakpoints.down('md')]: {
      fontSize: '28px',
      width: '300px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '250px',
      marginLeft: '20px',
      height: '70px',
      fontFamily: 'Poppins',
      fontSize: '18px',
    },
  },
  formCard: {
    width: '623px',
    [theme.breakpoints.down('md')]: {
      width: '500px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  image: {
    width: '100%',
    height: 'auto',
  }, 
  Footer:{
    [theme.breakpoints.down('sm')]: {
      marginTop: '120px',
    },
  }
}));

export default useStyles;
