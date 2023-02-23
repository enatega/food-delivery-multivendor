import makeStyles from "@mui/styles/makeStyles";
import bg from "../../../assets/images/bg.png";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-input": {
      color: theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.grey[200],
      },
      "&:hover fieldset": {
        borderColor: theme.palette.text.disabled,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    backgroundColor: theme.palette.grey[50],
    background: `url(${bg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center center",
  },
  loginBox: {
    background: theme.palette.common.white,
    paddingTop: "40px",
    paddingBottom: "40px",
    borderRadius: 20,
    textAlign: "center",
  },
}));

export default useStyles;
