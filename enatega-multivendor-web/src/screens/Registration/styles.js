import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  font700: {
    fontWeight: theme.typography.fontWeightBold,
  },
  caption: {
    fontSize: "0.875rem",
  },
  fontGrey: {
    color: theme.palette.text.disabled,
  },
  rowField: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: theme.spacing(1, 0),
  },
  btnBase: {
    height: "50px",
    backgroundColor: theme.palette.common.black,
    opacity: 1,
    transition: 'opacity 0.3s',
    "&:hover": {
      backgroundColor: theme.palette.common.black,
      opacity: 0.8,
    },
    width: "70%",
    borderRadius: 10,
  },
  codePicker: {
    width: "100%",
    marginRight: theme.spacing(2),
  },
  form: {
    display: "flex",
  },
}));

export default useStyles;
