import makeStyles from "@mui/styles/makeStyles";
import bg from "../../assets/images/img-map-background.jpeg";

const useStyles = makeStyles((theme) => ({
  marginHeader: {
    marginTop: "200px",
  },
  spinnerContainer: {
    flexDirection: "row",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    marginTop: "100px",
  },
  mapGrid: {
    height: "200px",
    width: "100%",
  },
  mapImage: {
    backgroundImage: `url(${bg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    marginLeft: "8%",
    marginTop: "20px",
    height: "150px",
    width: "80%",
    borderRadius: "10px",
  },
  mapText: {
    marginLeft: "20px",
    marginTop: "20px",
  },
  mapButton: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: "bold",
    marginLeft: "20px",
    boxShadow: `0 0 5px ${theme.palette.grey[300]}`,
    "&:hover": {
      background: theme.palette.success.main,
    },
  },
  searchWrapper: {
    width: "100%",
    marginTop: "-26px",
  },
  topRestContainer: {
    backgroundColor: theme.palette.button.lightest,
    borderRadius: "0px",
    width: "100%",
    paddingBottom: 10,
  },
  topRestWrapper: {
    background: theme.palette.button.dark,
    width: "90%",
    minHeight: "60vh",
    borderTopRightRadius: "5rem",
    borderBottomRightRadius: "5rem",
    display: "flex",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
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
}));

export default useStyles;
