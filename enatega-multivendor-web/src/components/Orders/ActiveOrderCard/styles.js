import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  disabledText: {
    color: theme.palette.text.disabled,
  },
  textBold: {
    fontWeight: 700,
  },
  smallText: {
    fontSize: "0.875rem",
  },
  link: {
    textDecoration: "none",
  },
}));

export default useStyles;
