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
    opacity: 1,
    backgroundColor: theme.palette.primary.black,
    transition: 'opacity 0.3s',
    "&:hover": {
    opacity: 0.8,
    backgroundColor: theme.palette.primary.black
    },
    width: "70%",
    borderRadius: 10,
  },
  form: {
    display: "flex",
  },
  codePicker: {
    width: 80,
    marginRight: theme.spacing(2),
  },
}));

export default useStyles;
