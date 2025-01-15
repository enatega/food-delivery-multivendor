import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100vh",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      height: "auto",
    },
  },
  leftSide: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "90px",
    [theme.breakpoints.down("lg")]: {
      width: "60%",
      padding: "15px",
    },
    [theme.breakpoints.down("md")]: {
      width: "60%",
      padding: "15px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      alignItems: "center",
      padding: "20px 10px",
    },
  },
  rightSide: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    [theme.breakpoints.down("lg")]: {
      width: "60%",
      padding: "15px",
    },
    [theme.breakpoints.down("md")]: {
      width: "40%",
      padding: "15px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: "20px 10px",
    },
  },
  heading: {
    fontFamily: "Poppins",
    fontSize: "48px",
    fontWeight: "600",
    lineHeight: "56px",
    letterSpacing: "-0.25px",
    textAlign: "left",
    color: "#3C3C3C",
    opacity: "1",
    marginBottom: "20px",
    [theme.breakpoints.down("md")]: {
      fontSize: "36px",
      lineHeight: "44px",
      textAlign: "center",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "24px",
      lineHeight: "32px",
      textAlign: "center",
    },
  },
  icon: {
    marginBottom: "-10px",
    width: "50px",
    height: "50px",
    [theme.breakpoints.down("md")]: {
      width: "40px",
      height: "40px",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: "140px",
      marginTop: "50px",
      width: "30px",
      height: "30px",
    },
  },
  rectangle: {
    opacity: "0.9",
    marginBottom: "10px",
    marginLeft: "10px",
    [theme.breakpoints.down("sm")]: {
      marginRight: "0",
    },
  },
  paragraph: {
    width: "511px",
    height: "auto",
    fontFamily: "Poppins",
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "26px",
    letterSpacing: "-0.25px",
    textAlign: "left",
    color: "#3C3C3C",
    padding: "20px",
    [theme.breakpoints.down("md")]: {
      width: "80%",
      fontSize: "12px",
      lineHeight: "22px",
      textAlign: "center",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      fontSize: "11px",
      lineHeight: "20px",
      textAlign: "center",
    },
  },
  formCard: {
    width: "723px",
    [theme.breakpoints.down("md")]: {
      width: "80%",
      maxWidth: "600px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      padding: "10px",
    },
  },
  phoneTextBox: {
    height: "240px",
    [theme.breakpoints.down("lg")]: {
      height: "150px",
    },
    [theme.breakpoints.down("md")]: {
      height: "140px",
    },
    [theme.breakpoints.down("sm")]: {
      height: "130px",
    },
  },
  gridContainer: {
    margin: "0 auto",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50px",
    marginBottom: "50px",
  },
}));

export default useStyles;
