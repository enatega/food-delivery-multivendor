import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  disabledText: {
    color: theme.palette.text.disabled,
  },
  textBold: {
    fontWeight: 700,
    maxWidth: "110px",
  },
  textPrice: {
    fontWeight: 700,
    marginTop: "10px",
    marginBottom: "10px",
  },
  smallText: {
    fontSize: "0.875rem",
  },
  link: {
    textDecoration: "none",
  },

  card: {
    background: "White",
    //padding: theme.spacing(2),
    //marginBottom: theme.spacing(4),
    borderRadius: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      width: "250px",
      marginLeft: "-20px",
    },
  },
  img: {
    borderStartStartRadius: theme.spacing(2),
    borderBottomLeftRadius: theme.spacing(2),
    width: 100,
    height: 100,
    [theme.breakpoints.down("sm")]: {
      width: 60,
      height: 60,
      borderBottomLeftRadius: theme.spacing(0),
      borderTopRightRadius: theme.spacing(2),
    },
  },
  divider: {
    background: theme.palette.common.black,
    marginTop: 10,
  },
  status: {
    borderRadius: 10,
    backgroundColor: theme.palette.common.white,
    padding: 13,
    width: 100,
    marginTop: theme.spacing(2),
  },
}));

export default useStyles;
