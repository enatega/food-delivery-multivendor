import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    minHeight: "64px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: theme.palette.primary.light,
  },
  font700: {
    fontWeight: 700,
  },
  ml: {
    marginLeft: "8px",
  },
  userTitle: {
    marginLeft: "8px",
    textTransform: "uppercase",
  },
  linkDecoration: {
    textDecoration: "none",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  imageIcon: {
    height: "50px",
    width: "10px",
  },
  iconRoot: {
    textAlign: "center",
    height: "100%",
    display: "inline-flex",
  },
}));

export default useStyles;
