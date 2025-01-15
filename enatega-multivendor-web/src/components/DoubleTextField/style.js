import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  textFieldRow: {
    display: "flex",
    gap: "20px",
    width: "100%",
    marginBottom: "20px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "10px",
    },
  },
  textField: {
    width: "100%",
    height: "42px",
    borderRadius: "10px", // Square-like shape with rounded corners
    border: "1px solid #E3E3E3", // Thin border
    padding: "0 15px",
    fontFamily: "Poppins",
    fontSize: "15px",
    fontWeight: "400",
    lineHeight: "24px",
    background: "#fffff",
    color: "#333333",
    outline: "none",
    boxSizing: "border-box",
    "&::placeholder": {
      fontSize: "15px",
      color: "#B1B1B1", // Thin placeholder text
    },
    [theme.breakpoints.down("lg")]: {
      fontSize: "14px",
      height: "38px",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "13px",
      height: "36px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "12px",
      height: "34px",
    },
  },
}));

export default useStyles;
