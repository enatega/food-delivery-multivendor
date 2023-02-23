import makeStyles from '@mui/styles/makeStyles';

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
  mainContainer: {
    position: "fixed",
    width: "100%",
    zIndex: 1300,
    top: "63px",
    backgroundColor: theme.palette.primary.light,
  },
  upperContainer: {
    padding: "20px 20px",
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
  button: {
    width: "70px",
    backgroundColor: theme.palette.primary.main,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    borderRadius: "0px",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  shadow: {
    boxShadow: theme.shadows["1"],
  },
}));

export default useStyle;
