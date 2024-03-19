import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  disabledText: {
    color: theme.palette.text.disabled,
  },
  textBold: {
    fontWeight: 700,
  },
  smallText: {
    fontSize: "0.875rem",
  },
  link: {
    textDecoration: "none",
  },
  card: {
    background: theme.palette.primary.main,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),

    borderRadius: theme.spacing(2),
  },
  img: {
    borderRadius: theme.spacing(2),
    width: 100,
    height: 100,
    [theme.breakpoints.down("md")]: {
      width: 60,
      height: 60,
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
