import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    marginTop: "50px",
    minHeight: "50vh",
    marginBottom: "120px",
  },
  headingContainer: {
    display: "flex",
  },
  boldBackground: {
    position: "relative",
    marginBottom: (props) => (props.extraSmall ? "-30px" : "-50px"),
    fontSize: (props) =>
      props.extraSmall ? "6rem" : props.mobile ? "10rem" : "12rem",
    lineHeight: "1em",
    color: "rgba(0,0,0,0.04)",
    fontWeight: "700",
    overflow: "hidden",
  },
  bold300: {
    position: "absolute",
    bottom: (props) => (props.extraSmall ? "30px" : "50px"),
    fontWeight: "300",
    color: "#333",
  },
  modalBox: {
    alignSelf: "flex-end",
    paddingTop: (props) => (props.extraSmall ? "50px" : undefined),
  },
  infoContainer: {
    display: "flex",
    minHeight: "50vh",
    background: `url(https://images.deliveryhero.io/image/foodpanda/home-vendor-pk.jpg?width=2000&height=1280) no-repeat right top`,
    backgroundPositionY: "52%",
  },
  infoCard: {
    backgroundColor: theme.palette.common.white,
    borderRadius: "0px",
    maxWidth: "550px",
    padding: "20px",
    marginBottom: "-70px",
    boxShadow: "0px 0px 20px 1px rgba(0,0,0,0.2)",
  },
  infotTitle: {
    color: theme.palette.secondary.light,
    fontWeight: "300",
    fontSize: "1.8rem",
    lineHeight: "1.2em",
  },
  infoDescription: {
    color: "#707070",
    fontWeight: "300",
    fontSize: "1rem",
    margin: "16px 0",
  },
  infoBtn: {
    margin: (props) => (props.extraSmall ? undefined : theme.spacing(3, 0)),
    float: (props) => (props.extraSmall ? undefined : "right"),
    borderRadius: "0px",
    height: "55px",
    width: (props) => (props.extraSmall ? "220px" : "250px"),
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      opacity: 0.8,
    },
  },
}));

export default useStyle;
