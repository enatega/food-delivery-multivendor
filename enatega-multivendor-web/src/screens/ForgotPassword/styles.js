import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-input": {
      color: theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.grey[200],
      },
      "&:hover fieldset": {
        borderColor: theme.palette.text.disabled,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  font700: {
    fontWeight: theme.typography.fontWeightBold,
  },
  caption: {
    fontSize: "0.875rem",
  },
  fontGrey: {
    color: theme.palette.text.disabled,
  },
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    backgroundColor: theme.palette.grey[50],
  },
  loginBox: {
    background: theme.palette.common.white,
    paddingTop: "40px",
    paddingBottom: "40px",
    boxShadow: theme.shadows[1],
  },
  btnBase: {
    borderRadius: 10,
    width: "70%",
    height: "50px",
    backgroundColor: theme.palette.common.black,
    "&:hover": {
      opacity: 0.8,
    },
  },

  btnText: {
    width: "inherit",
  },
}));

export default useStyles;
