import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme, mobile) => ({
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
    bottom: "130px",
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
  review: {
    position: "fixed",
    right: "20px",
    bottom: "200px",
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
  modal: {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      width: mobile ? "80%" : "50%", // Add the desired width here
      height: mobile ? "40%" : "35%", // Add the desired height here
    },
    overlay: {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  modalContainer: {
    flex: 1,
    textAlign: "-webkit-center",
    padding: mobile ? 0 : "30px",
  },
  title: {
    width: "100%",
    height: "100%",
  },
  starContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  starWrapper: {
    width: "70%",
    height: "60%",
  },
  inputContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginTop: "30px",
    height: "100%",
    color: theme.palette.common.black,
    width: mobile ? "100%" : "40%",
    // border: "none",
    // borderBottom: "1px solid theme.palette.secondary.light",
    borderColor: theme.palette.grey[300],
    borderWidth: "1px",
    borderStyle: "groove",
    outline: "none",
    padding: "0.6%",
  },
  submitContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  submit: {
    width: "80%",
    height: "10%",
  },
  submitButton: {
    width: "40%",
    color: "white",
    backgroundColor: theme.palette.primary.main,
    marginTop: "20px",
    border: "none",
    padding: "10px",
  },
  backdrop: {
    backgroundColor: theme.palette.common.black,
  },
  closeButton: {
    position: 'absolute',
    top: 30, // Adjust the top value as needed
    right: 10, // Adjust the right value as needed
    cursor: 'pointer',
  },
}));

export default useStyles;
