import makeStyles from "@mui/styles/makeStyles";
import Info from "../../../assets/images/info-bg.png";

const useStyle = makeStyles((theme) => ({
  textField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px",
      },
    },
  },
  font700: {
    fontWeight: theme.typography.fontWeightBold,
  },
  bgText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    fontSize: 80,
    fontWeight: 500,
    color: theme.palette.common.black,
    mixBlendMode: "normal",
    opacity: 0.24,
  },
  bgTextSmall: {
    position: "absolute",
    top: 0,
    right: 10,
    fontSize: 50,
    fontWeight: 500,
    color: theme.palette.common.black,
    mixBlendMode: "normal",
    opacity: 0.24,
  },
  textArea: {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px",
      },
    },
  },
  contactInfo: {
    width: "80%",
    margin: "auto",
    backdropFilter: "blur(3px)",
    borderRadius: "38px",
    backgroundImage: `url(${Info})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  margin: {
    marginTop: "4rem",
    marginBottom: "4rem",
  },
  contactIcon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: theme.palette.common.black,
    width: 40,
    height: 40,
    borderRadius: "40%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bg: {
    backgroundColor: "rgb(60 143 124 / 51%)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "460px",
    borderRadius: "38px",
  },
}));

export default useStyle;
