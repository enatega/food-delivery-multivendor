import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginBottom: theme.spacing(3),
    },
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
    "& .MuiButton-contained": {
      borderRadius: "0px",
      height: "50px",
      "&:hover": {
        opacity: 0.8,
        backgroundColor: theme.palette.primary.main,
      },
    },
    backgroundColor: theme.palette.primary.dark,
  },
  marginHeader: {
    marginTop: "140px",
  },
  topContainer: {
    marginTop: "210px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bg: {
    position: "absolute",
    left: "-100px",
    [theme.breakpoints.down("md")]: {
      left: "-50px",
    },
    maxWidth: "100%",
  },
  footerContainer: {
    background: theme.palette.primary.dark,
    width: "100%",
    marginTop: 100,
  },
  footerWrapper: {
    backgroundColor: theme.palette.primary.main,
    width: "90%",
    display: "flex",
    marginLeft: "auto",
    borderTopLeftRadius: "5rem",
    borderBottomLeftRadius: "5rem",
  },
}));

export default useStyles;