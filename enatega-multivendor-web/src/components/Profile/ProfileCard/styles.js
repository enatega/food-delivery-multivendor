import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  MH3: {
    margin: theme.spacing(3, 0),
  },
  mainContainer: {
    justifyContent: "center",
  },
  profileContainer: {
    padding: theme.spacing(0, 3),
  },
  textBold: {
    fontWeight: 700,
  },
  btnContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export default useStyles;
