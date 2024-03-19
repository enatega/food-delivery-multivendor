import makeStyles from "@mui/styles/makeStyles";
//import ConfigurableValues from "../../config/constants";

// const { COLORS } = ConfigurableValues();
const COLORS = "#dd4b39";
const useStyles = makeStyles((theme) => ({
  font700: {
    fontWeight: theme.typography.fontWeightBold,
  },
  caption: {
    fontSize: "0.875rem",
  },
  fontGrey: {
    color: theme.palette.common.black,
  },
  fontSubHead: {
    color: theme.palette.primary.main,
  },
  btnBase: {
    height: "50px",
    width: "80%",
    borderRadius: 5,
    boxShadow: theme.shadows[2],
  },
  appleBtn: {
    background: "#2C2C2C",
    marginTop: "20px",
  },
  customBtn: {
    background: theme.palette.common.black,
    width: "70%",
    transition: "opacity 0.3s",
    opacity: 1,
    "&:hover": {
      backgroundColor: theme.palette.common.black,
      opacity: 0.8,
    },
  },
  gButton: {
    marginTop: theme.spacing(3),
    background: COLORS.GOOGLE,
    transition: "opacity 0.3s",
    "&:disabled": {
      backgroundColor: COLORS.GOOGLE,
    },
    "&:hover": {
      opacity: 0.8,
      backgroundColor: COLORS.GOOGLE,
    },
  },
  btnText: {
    width: "inherit",
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: theme.palette.common.black,
    margin: 10,
  },
}));

export default useStyles;
