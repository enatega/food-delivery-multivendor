import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    padding: theme.spacing(0, 3),
  },
  center: {
    justifyContent: "center",
  },
  textBold: {
    fontWeight: 700,
  },
  heading: {
    fontSize: "2.175rem",
  },
  bottomContainer: {
    marginTop: theme.spacing(10),
    backgroundColor: theme.palette.grey[100],
  },
  w70: {
    width: "70%",
  },
  mv2: {
    margin: theme.spacing(2, 0),
  },
  mt3: {
    marginTop: theme.spacing(3),
  },
  ph1: {
    padding: theme.spacing(0, 1),
  },

  disabledText: {
    color: theme.palette.text.disabled,
  },
  smallText: {
    fontSize: "0.875rem",
  },
}));

export default useStyles;
