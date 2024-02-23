import makeStyles from "@mui/styles/makeStyles";
import Fish from "../../../assets/images/fish.png";

const useStyle = makeStyles((theme) => ({
  option: {
    minHeight: "auto",
    alignItems: "flex-start",
    padding: 8,
    '&[aria-selected="true"]': {
      backgroundColor: "transparent",
    },
    '&[data-focus="true"]': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  mainContainer: {
    display: "flex",
    paddingTop: "70px",
    minWidth: "100%",
    backgroundColor: "transparent",
  },
  temp: {
    height: "80vh",
    width: "100%",
  },
  left: {
    minHeight: "80vh",

    [theme.breakpoints.down("md")]: {
      position: "relative",
    },
  },
  right: {
    backgroundColor: theme.palette.primary.main,
    borderBottomLeftRadius: "5rem",
    borderTopLeftRadius: "5rem",
    minHeight: "80vh",
    display: "flex",
    marginTop: "2px",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${Fish})`,
    backgroundSize: "contain",
    backgroundPosition: "right",
    backgroundRepeat: "no-repeat",
    [theme.breakpoints.down("md")]: {
      borderBottomLeftRadius: "0rem",
      borderTopLeftRadius: "0rem",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "60vh",
    },
  },
  headingContainer: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 0,
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.black,
    boxShadow: "0px 0px 20px 1px rgba(0,0,0,0.2)",
    borderRadius: 10,
    position: "relative",
  },
  button: {
    // margin: (props) => (props.extraSmall ? "10px 0px 0px" : "0px 10px"),
    height: "55px",
    color: theme.palette.common.black,
    fontWeight: 700,
    borderRadius: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      width: "180px",
    },
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  foodCategories: {
    background: " rgb(0 0 0 / 48%)",
    backdropFilter: "blur(16px)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    minHeight: "160px",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: "75% ",
  },
  mobileheadingContainer: {
    padding: 10,
    position: "absolute",
    bottom: -10,
    left: 0,
    background: "rgb(0 0 0 / 48%)",
    backdropFilter: "blur(16px)",
    borderRadius: 30,
    marginBottom: "50px",
  },
  mobileheadingContainerNotHome: {
    padding: 20,
    position: "absolute",
    bottom: -10,
    left: 0,
    background: "rgb(0 0 0 / 48%)",
    backdropFilter: "blur(16px)",
    borderRadius: 30,
    marginBottom: "50px",
  },
  foodCategoriesMobile: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "160px",
    width: "100% ",
  },
  mobileBox: {
    width: "100%",
  },
  textField: {
    color: "initial",
    backgroundColor: "white",
    borderRadius: 10,
    border: "none",
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
        borderWidth: "1px",
      },
    },
  },
}));

export default useStyle;
