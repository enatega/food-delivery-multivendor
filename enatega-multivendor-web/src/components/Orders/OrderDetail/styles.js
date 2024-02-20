import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
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
  center: {
    justifyContent: "center",
    padding: theme.spacing(2, 3),
  },
  cardContainer: {
    background: theme.palette.common.white,
    borderRadius: 0,
  },
  dot: {
    fontSize: 10,
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(0.5),
  },
  imgContainer: {
    maxWidth: "158px",
    backgroundSize: "cover",
  },
  disabledText: {
    color: theme.palette.text.disabled,
  },
  textBold: {
    fontWeight: 700,
  },
  smallText: {
    fontSize: "0.875rem",
  },
  cardRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(0.1, 0),
  },
  btnBase: {
    borderRadius: "0px",
  },
  topOrder: {
    display: "flex",
    alignItems: "center",
  },
  innerTopOrder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      padding: 10,
      backgroundColor: theme.palette.common.black,
      width: "100%",
      justifyContent: "flex-start",
      borderRadius: 20,
    },
  },
  typos: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      width: "100%",
      justifyContent: "space-between",
    },
  },

  innerBottomOrder: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      marginTop: theme.spacing(3),
    },
  },
  heading: {
    fontSize: "2.175rem",
  },
  bottomOrder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      marginBottom: theme.spacing(3),
      padding: 10,
    },
  },
  mediumText: {
    fontSize: "1.0rem",
  },
  mediumBoldText: {
    fontSize: "1.2rem",
    color: theme.palette.common.black,
    fontWeight: "600",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    backgroundColor: theme.palette.common.white,
    border: "2px solid theme.palette.common.white",
    outline: 0,
    borderRadius: 10,
    padding: `${theme.spacing(6)} ${theme.spacing(4)} ${theme.spacing(
      6
    )} ${theme.spacing(4)}`,
  },
  btn: {
    width: "200px",
    borderRadius: 20,
    padding: 10,
    marginTop: theme.spacing(4),
    fontWeight: 600,
    color: "black",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },

  btnWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

export default useStyles;
