import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  font700: {
    fontWeight: theme.typography.fontWeightBold,
  },
  caption: {
    fontSize: "0.875rem",
  },
  fontGrey: {
    color: theme.palette.grey[500],
  },
  rowField: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: theme.spacing(2, 0),
  },
  btnBase: {
    height: "50px",
    backgroundColor: theme.palette.common.black,
    transition: "opacity 0.3s",
    opacity: 1,
    "&:hover": {
      backgroundColor: theme.palette.common.black,
      opacity: 0.8,
    },
    width: "70%",
    borderRadius: 10,
  },
  form: {
    display: "flex",
  },
}));

export default useStyles;
