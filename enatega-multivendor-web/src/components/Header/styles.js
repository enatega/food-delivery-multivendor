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
  menu: {
    marginTop: theme.spacing(3),
  },
  menuItem: {
    padding: "14px 40px",
    "& .MuiTouchRipple-root span": {
      backgroundColor: "rgba(0,0,0,0.3)",
    },
  },
  linkDecoration: {
    textDecoration: "none",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  cartText: {
    marginLeft: 2,
    fontWeight: 700,
  },
  imageIcon: {
    height: "100%",
    display: "inline-flex",
    backgroundColor: "red",
  },
  iconRoot: {
    textAlign: "center",
    height: "50px",
    width: "50px",
  },
}));

export default useStyles;
