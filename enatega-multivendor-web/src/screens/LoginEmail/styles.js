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
    backgroundColor: theme.palette.common.black,
    "&:hover": {
      opacity: 0.8,
    },
    width: "70%",
    borderRadius: 10,
  },
  grayText: {
    color: theme.palette.grey[600],
  },
}));

export default useStyles;
