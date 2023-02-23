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
  line: {
    margin: theme.spacing(2, 0),
  },
}));

export default useStyles;
