import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  font700: {
    fontWeight: theme.typography.fontWeightBold,
  },
  caption: {
    fontSize: "0.875rem",
  },
  fontGrey: {
    color: theme.palette.text.disabled,
  },
  btnBase: {
    borderRadius: "0px",
    height: "50px",
    opacity: 1,
    backgroundColor: theme.palette.primary.main,
    transition: 'opacity 0.3s',
    "&:hover": {
      opacity: 0.8,
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default useStyles;
