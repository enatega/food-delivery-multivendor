import makeStyles from "@mui/styles/makeStyles";
import Web from "../../assets/images/web.png";
import Blog from "../../assets/images/blog-bg.png";
import Contact from "../../assets/images/contact-pg.png";
import Categories from "../../assets/images/categories-bg.png";
import Price from "../../assets/images/price-bg.png";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-root": {
      color: theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: theme.palette.common.black,
      },
    },
    overflowX: "hidden",
  },
  cardContainer: {
    background:
      "linear-gradient(180deg, theme.palette.common.whiteShade 0%, theme.palette.common.white 100%)",
    borderRadius: "0px",
    // padding: "40px",
  },
  RightWrapper: {
    backgroundColor: theme.palette.primary.main,
    width: "90%",
    minHeight: "90vh",
    display: "flex",
    marginLeft: "auto",
    // padding: "10rem 0rem 10rem 0rem",
    borderTopLeftRadius: "5rem",
    borderBottomLeftRadius: "5rem",
  },
  cardWrapper: {
    backgroundColor: theme.palette.primary.main,
    width: "90%",
    minHeight: "90vh",
    display: "flex",
    marginLeft: "auto",
    borderTopLeftRadius: "5rem",
    borderBottomLeftRadius: "5rem",
    backgroundImage: `url(${Categories})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  },
  blogWrapper: {
    backgroundColor: theme.palette.primary.main,
    width: "90%",
    minHeight: "90vh",
    display: "flex",
    marginLeft: "auto",
    borderTopLeftRadius: "5rem",
    borderBottomLeftRadius: "5rem",
    backgroundImage: `url(${Blog})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    position: "relative",

    [theme.breakpoints.down("md")]: {
      backgroundImage: "none",
    },
  },
  appContainer: {
    backgroundColor: theme.palette.common.white,
    borderRadius: "0px",
    width: "100%",
    height: "auto",
  },
  contactContainer: {
    background:
      "linear-gradient(180deg, theme.palette.secondary.lightest 0%, theme.palette.primary.main 100%)",
    borderRadius: "0px",
    width: "100%",
    [theme.breakpoints.down("md")]: {
      background: theme.palette.primary.main,
    },
  },
  leftWrapper: {
    background:
      "linear-gradient(180deg, theme.palette.common.whiteShade 0%, theme.palette.common.white 100%)",
    width: "80%",
    minHeight: "80vh",
    borderTopRightRadius: "5rem",
    borderBottomRightRadius: "5rem",
    position: "relative",
  },
  appWrapper: {
    background:
      "linear-gradient(180deg, theme.palette.common.white 0%, theme.palette.common.whiteShade 100%)",
    width: "80%",
    minHeight: "110vh",
    borderTopRightRadius: "5rem",
    borderBottomRightRadius: "5rem",
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      width: "90%",
    },
  },
  priceContainer: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "0px",
    width: "100%",
    clear: "both",
  },
  priceWrapper: {
    background: "white",
    width: "90%",
    minHeight: "90vh",
    borderTopRightRadius: "5rem",
    borderBottomRightRadius: "5rem",
    display: "flex",
    alignItems: "center",
    position: "relative",
    backgroundImage: `url(${Price})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  bgText: {
    position: "absolute",
    bottom: 100,
    right: 200,
    fontSize: 80,
    fontWeight: 500,
    color: theme.palette.common.black,
    mixBlendMode: "normal",
    opacity: 0.24,
  },
  bgTextSmall: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 50,
    fontWeight: 500,
    color: theme.palette.common.black,
    mixBlendMode: "normal",
    opacity: 0.24,
  },
  caseContainer: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "0px",
    width: "100%",
    clear: "both",
  },
  caseWrapper: {
    background:
      "linear-gradient(180.27deg, theme.palette.info.lightest 0.09%, theme.palette.info.light 36.76%, theme.palette.success.darkest 72.67%, theme.palette.success.lightest 99.63%)",
    width: "90%",
    minHeight: "95vh",
    borderTopRightRadius: "5rem",
    borderBottomRightRadius: "5rem",
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  techContainer: {
    background:
      "linear-gradient(180.62deg, theme.palette.info.darkest 0.54%, theme.palette.info.dark 100.36%)",
  },
  techWrapper: {
    backgroundColor: theme.palette.primary.main,
    width: "90%",
    minHeight: "90vh",
    display: "flex",
    marginLeft: "auto",
    borderTopLeftRadius: "5rem",
    borderBottomLeftRadius: "5rem",
    backgroundImage: `url(${Web})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  blogContainer: {
    background:
      "linear-gradient(180deg, theme.palette.shades.main 0%, theme.palette.error.light 100%)",
  },
  contactWrapper: {
    background:
      "linear-gradient(180deg, theme.palette.shades.light 0%, theme.palette.common.white 100%)",
    width: "95%",
    minHeight: "80vh",
    borderTopRightRadius: "5rem",
    borderBottomRightRadius: "5rem",
    display: "flex",
    backgroundImage: `url(${Contact})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  footerContainer: {
    background: "white",
    width: "100%",
    marginTop: "60px",
  },
  footerWrapper: {
    backgroundColor: theme.palette.primary.main,
    width: "90%",
    display: "flex",
    marginLeft: "auto",
    borderTopLeftRadius: "5rem",
    borderBottomLeftRadius: "5rem",
  },
  searchWrapper: {
    width: "100%",
    marginTop: -28,
  },
  upperFruits: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
  },
  bannerContainer: {
    position: "absolute",
    left: "52%",
    top: "5%",
    zIndex: 1000,
    [theme.breakpoints.down("md")]: {
      position: "relative",
    },
  },
  bannerTwo: {
    maxWidth: "40vw",
    width: "40%",
    height: "40%",
    marginTop: "15%",
  },
  bannerOne: {
    width: "40%",
    height: "40%",
    maxWidth: "60vw",
    marginTop: "30%",
  },
  topBottomMargin: {
    marginTop: "10rem",
    marginBottom: "10rem",
  },
  lowerFruits: { position: "absolute", left: 0, top: 0, height: "100%" },
}));

export default useStyles;
