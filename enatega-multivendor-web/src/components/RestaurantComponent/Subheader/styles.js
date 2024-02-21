import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-root": {
      color: theme.palette.text.secondary,
    },
    "& label.Mui-focused": {
      color: theme.palette.text.secondary,
    },
    "& .MuiInput-underline:after": {
      borderColor: theme.palette.grey["300"],
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.grey["300"],
        borderRadius: 20,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.grey["300"],
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.grey["300"],
      },
    },
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  upsideContainer: {
    position: "fixed",
    maxHeight: "100%", // Set the maximum height to the viewport height
    minWidth: "670px",
    zIndex: 1300,
    top: "63px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "300px",
      width: "95%",
      top: "63px",
    },
  },
  mainContainer: {
    position: "fixed",
    minWidth: "670px",
    zIndex: 1300,
    top: "63px",
    backgroundColor: "#ffffffd1",
    borderRadius: 20,
    margin: 10,
    [theme.breakpoints.down("sm")]: {
      minWidth: "300px",
      width: "95%",
      top: "63px",
    },
  },
  upperContainer: {
    padding: "20px 20px",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    [theme.breakpoints.down("sm")]: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
  },
  mr10: {
    marginRight: "10px",
  },
  smallText: {
    fontSize: "0.75rem",
  },
  textBold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  textMBold: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  button: {
    width: "70px",
    backgroundColor: theme.palette.primary.main,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    padding: 10,
    borderRadius: 10,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  shadow: {
    boxShadow: theme.shadows["1"],
  },
  addressBtn: {
    textAlign: "inherit",
    justifyContent: "flex-start",
    padding: 0,
    width: "100%",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: 20,
  },
}));

export default useStyle;
