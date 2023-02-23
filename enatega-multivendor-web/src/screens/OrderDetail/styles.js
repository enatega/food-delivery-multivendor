import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    padding: theme.spacing(0, 3),
  },
  center: {
    justifyContent: "center",
  },
  textBold: {
    fontWeight: 700,
  },
  heading: {
    fontSize: "2.175rem",
  },
  topContainer: {
    position: "relative",
    marginTop: "40px",
  },
  orderStatus: {
    position: "absolute",
    bottom: -80,
    height: 180,
    marginLeft: theme.spacing(8),
    backgroundColor: theme.palette.common.black,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    [theme.breakpoints.down("md")]: {
      marginLeft: theme.spacing(0),
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: theme.spacing(0),
      height: "fit-content",
      borderRadius: 20,
      backgroundColor: theme.palette.grey[200],
    },
  },
  greyText: {
    color: theme.palette.grey[700],
  },
  lightGrey: {
    color: theme.palette.primary.main,
  },
  bottomContainer: {
    marginTop: theme.spacing(10),
    backgroundColor: theme.palette.grey[100],
  },
  spinnerContainer: {
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
  },
  chat: {
    position: "fixed",
    right: "20px",
    bottom: "15px",
    background: theme.palette.common.black,
    padding: theme.spacing(2, 3),
    borderRadius: 10,
    borderBottomRightRadius: 0,
    cursor: "pointer",
    [theme.breakpoints.down("sm")]: {
      right: "10px",
      bottom: "10px",
    },
  },
  w70: {
    width: "70%",
  },
  mv2: {
    margin: theme.spacing(2, 0),
  },
  mt3: {
    marginTop: theme.spacing(3),
  },
  ph1: {
    padding: theme.spacing(0, 1),
  },

  cardContainer: {
    background: theme.palette.common.white,
    borderRadius: 0,
  },
  disabledText: {
    color: theme.palette.text.disabled,
  },
  smallText: {
    fontSize: "0.875rem",
  },
  mediumText: {
    fontSize: "1.0rem",
  },
  mediumBoldText: {
    fontSize: "1.2rem",
    color: theme.palette.common.black,
    fontWeight: "600",
  },
  cardRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(0.1, 0),
  },
  btnBase: {
    borderRadius: "0px",
  },
  paperContainer: {
    width: "fit-content",
  },
}));

export default useStyles;
