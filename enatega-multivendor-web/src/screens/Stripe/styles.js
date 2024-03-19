import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.grey[100],
    minHeight: "100vh",
  },
  mainContainer: {
    marginTop: "70px",
    padding: theme.spacing(6, 0),
    justifyContent: "center",
    background: theme.palette.grey[100],
  },
  link: {
    textDecoration: "none",
  },
  btn: {
    backgroundColor: theme.palette.button.light,
    minWidth: "50%",
    height: "100%",
    borderRadius: 5,
    boxShadow: theme.shadows[0],
    justifyContent: "space-between",
    padding: theme.spacing(1.5),
    border: `1px solid ${theme.palette.grey[300]}`,
    "&:hover": {
      backgroundColor: theme.palette.button.light,
      opacity: 0.8,
    },
  },
}));

export default useStyles;
