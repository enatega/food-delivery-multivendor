import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    padding: theme.spacing(0, 3),
  },
  loadingContainer: {
    marginTop: "64px",
  },
  mainContainer: {
    marginTop: "200px",
  },
  center: {
    justifyContent: "center",
  },
  textBold: {
    fontWeight: 700,
  },
  line: {
    margin: theme.spacing(2, 0),
  },
  titleStyle: {
    ...theme.typography.h5,
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
  restuarantTitle: {
    ...theme.typography.body2,
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
  smallText: {
    ...theme.typography.caption,
    color: theme.palette.text.disabled,
    fontSize: "0.875rem",
  },
}));

export default useStyles;
