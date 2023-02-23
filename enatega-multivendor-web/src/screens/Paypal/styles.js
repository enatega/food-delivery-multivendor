import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.grey[100],
    minHeight: "100vh",
  },
  mainContainer: {
    marginTop: "70px",
    padding: theme.spacing(6, 0),
    justifyContent: "center",
    background: theme.palette.grey[100],
  },
  link: {
    textDecoration: "none",
  },
}));

export default useStyles;
