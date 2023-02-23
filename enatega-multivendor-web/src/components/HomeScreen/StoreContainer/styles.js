import makeStyles from '@mui/styles/makeStyles';

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
    marginBottom: "-50px",
    fontSize: (props) => (props.extraSmall ? "8rem" : props.mobile ? "10rem" : "12rem"),
    lineHeight: "1em",
    color: "rgba(0,0,0,0.04)",
    fontWeight: "700",
  },
  bold300: {
    position: "absolute",
    bottom: "50px",
    fontWeight: "300",
    color: "#333",
  },
  storeContainer: {
    display: "flex",
    minHeight: "50vh",
    backgroundColor: theme.palette.primary.main,
    alignItems: "center",
    paddingTop: (props) => (props.mobile ? "50px" : undefined),
    paddingBottom: (props) => (props.mobile ? "50px" : undefined),
  },
  storeTitle: {
    fontSize: "1.8rem",
    lineHeight: "1.14em",
  },
  storeDescription: {
    fontSize: "1rem",
    fontWeight: "300",
    lineHeight: "1.14em",
    margin: "16px 0",
  },
  btnBase: {
    borderRadius: "0px",
    height: "55px",
    marginRight: "10px",
    marginTop: (props) => (props.mobile ? "10px" : undefined),
    borderWidth: "1px",
    borderColor: "white",
  },
  imgContainer: {
    display: (props) => (props.extraSmall ? "flex" : "block"),
    overflow: "hidden",
    alignSelf: "center",
    justifyContent: (props) => (props.extraSmall ? "center" : "flex-end"),
    // marginTop: (props) => (props.extraSmall ? "20px" : undefined),
  },
  linkDecoration: {
    textDecoration: "none",
    alignSelf: "center",
  },
}));

export default useStyle;
