import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
  },
  mt2: {
    marginTop: theme.spacing(2),
  },
  PV3: {
    padding: theme.spacing(3, 0),
  },
  contentContainer: {
    padding: theme.spacing(0, 3),
  },
  topContainer: {
    marginTop: "165px",
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
  mainContainer: {
    marginTop: "50px",
    minHeight: "100vh",
  },
  center: {
    justifyContent: "center",
  },
  spinnerContainer: {
    flexDirection: "row",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  title: {
    fontWeight: theme.typography.fontWeightLight,
    fontSize: "3rem",
    color: theme.palette.secondary.light,
  },
  textBold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  disableText: {
    color: theme.palette.text.disabled,
  },
  smallText: {
    fontSize: "0.875rem",
  },
  btnBase: {
    borderRadius: "0px",
    height: "50px",
  },
  heartBG: {
    display: "flex",
    backgroundColor: theme.palette.common.white,
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 15,
    boxShadow: theme.shadows[5],
  },
  footerContainer: {
    background: theme.palette.success.dark,
    width: "100%",
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
