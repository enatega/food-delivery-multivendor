import makeStyles from '@mui/styles/makeStyles';
import Background from "../../../assets/images/bg_Search.jpeg";

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
  headingContainer: {
    display: "flex",
    alignItems: "center",
    minHeight: "80vh",
    backgroundImage: `url(${Background})`,
    backgroundPosition: "right",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    boxShadow: "0px 0px 20px 1px rgba(0,0,0,0.2)",
  },
  button: {
    margin: (props) => (props.extraSmall ? "10px 0px 0px" : "0px 10px"),
    height: "55px",
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default useStyle;
