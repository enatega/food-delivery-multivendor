import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  textBox: {
    width: "100%",
    maxWidth: "500px",
    height: "180px",
    borderRadius: "10px",
    border: "1.5px solid #E3E3E3",
    padding: "15px",
    fontFamily: "Poppins",
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "24px",
    textAlign: "left",
    background: "#fffff",
    color: "#333333",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "20px",
    resize: "none",
    "&::placeholder": {
      fontFamily: "Poppins",
      fontSize: "15px",
      fontWeight: "400",
      lineHeight: "24px",
      textAlign: "left",
      color: "#B1B1B1",
    },
    [theme.breakpoints.down("lg")]: {
      height: "100px",
      fontSize: "15px",
    },
    [theme.breakpoints.down("md")]: {
      height: "90px",
      fontSize: "15px",
    },
    [theme.breakpoints.down("sm")]: {
      height: "80px",
      fontSize: "14px",
      borderRadius: "16px",
    },
  },
  phoneTextBox: {
    height: "270px",
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
}));

export default useStyles;
