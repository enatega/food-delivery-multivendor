import makeStyles from "@mui/styles/makeStyles";
import Bg from "../../assets/images/bg-invert.png";
const useStyles = makeStyles((theme) => ({
  marginHeader: {
    marginTop: "200px",
  },
  active: {
    color: theme.palette.primary.main,
    borderBottom: `6px solid ${theme.palette.primary.main}`,
    marginBottom: "-4px",
  },
  anchorStyle: {
    textDecoration: "none",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  tabTextStyle: {
    ...theme.typography.subtitle2,
    color: theme.palette.common.black,
    fontWeight: 600,
    [theme.breakpoints.down("md")]: {
      fontSize: "0.6rem",
    },
  },
  tabListStyle: {
    padding: "16px 16px 16px 16px",
    [theme.breakpoints.down("md")]: {
      padding: "8px",
    },
  },
  imageContainer: {
    width: "100%",
    height: "324px",
    backgroundImage: `url('https://images.deliveryhero.io/image/fd-pk/LH/v1bq-hero.jpg?width=2000&amp;height=500')`,
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    position: "relative",
    borderBottomLeftRadius: 40,
    boxShadow:
      "inset 0 0 0 1000px rgba(0, 0, 0, 0), inset 0 0 0 1000px theme.palette.common.lightBlack",
    borderBottomRightRadius: 40,
  },
  tabContainer: {
    width: "100%",
    background: theme.palette.primary.light,
    height: "71px",
    display: "flex",
    alignItems: "center",
    position: "sticky",
    top: "140px",
    zIndex: 1200,
    borderRadius: 10,
  },
  scrollpyStyles: {
    display: "flex",
    alignItems: "center",
    listStyleType: "none",
    justifyContent: "space-evenly",
    width: "100%",
    paddingLeft: 0,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    overflow: "visible",
  },

  categoriesStyle: {
    ...theme.typography.subtitle2,
    color: theme.palette.text.disabled,
  },
  spinnerContainer: {
    flexDirection: "row",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(20, 0),
  },
  footerContainer: {
    background: theme.palette.success.dark,
    width: "100%",
  },
  footerWrapper: {
    backgroundColor: theme.palette.primary.main,
    width: "90%",
    display: "flex",
    marginLeft: "auto",
    borderTopLeftRadius: "5rem",
    borderBottomLeftRadius: "5rem",
  },
  restaurantDetail: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%,-50%)",
    backgroundColor: theme.palette.common.darkBlack,
    minWidth: "250px",
  },
  bg: {
    backgroundImage: `url(${Bg})`,
    backgroundPositionX: "left",
    backgroundPositionY: "bottom",
    backgroundSize: "400px",
    backgroundRepeat: "no-repeat",
  },
}));

export default useStyles;
