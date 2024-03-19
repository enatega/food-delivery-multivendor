import makeStyles from "@mui/styles/makeStyles";

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
    height: "50px",
    opacity: 1,
    backgroundColor: theme.palette.primary.main,
    transition: 'opacity 0.3s',
    "&:hover": {
      opacity: 0.8,
      backgroundColor: theme.palette.primary.main
    },
    width: "70%",
    borderRadius: 10,
  },
  customBtn: {
    background: theme.palette.common.main,
    width: "70%",
    transition: "opacity 0.3s",
    opacity: 1,
    "&:hover": {
      backgroundColor: theme.palette.common.main,
      opacity: 0.8,
    },
  },
  grayText: {
    color: theme.palette.grey[600],
  },
}));

export default useStyles;
