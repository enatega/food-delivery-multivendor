import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.dark,
  },
  contentContainer: {
    padding: theme.spacing(0, 3),
  },
  loadingContainer: {
    marginTop: "64px",
  },
  mainContainer: {
    marginTop: "200px",
    marginBottom: "200px",
    position: "relative",
    backgroundColor: theme.palette.common.white,
    boxShadow: "0px 0px 22px rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
  },
  center: {
    justifyContent: "center",
    marginTop: 100,
    marginBottom: 100,
  },
  topContainer: {
    position: "relative",
    width: "100%",
  },
  bg: {
    position: "absolute",
    left: "-100px",
    [theme.breakpoints.down("md")]: {
      left: "-50px",
    },
    maxWidth: "100%",
    marginTop: "60px",
  },
  textBold: {
    fontWeight: 700,
  },
  line: {
    margin: theme.spacing(2, 0),
  },
  titleStyle: {
    ...theme.typography.h5,
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
  restuarantTitle: {
    ...theme.typography.body2,
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
  smallText: {
    ...theme.typography.caption,
    color: theme.palette.text.disabled,
    fontSize: "0.875rem",
  },
  footerContainer: {
    background: theme.palette.primary.dark,
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
