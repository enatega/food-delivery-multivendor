import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  mt: {
    marginTop: theme.spacing(4),
  },
  m: {
    marginTop: theme.spacing(4),
    marginRight: theme.spacing(10),
  },
  link: {
    textDecoration: "none",
  },
  button: {
    background: theme.palette.primary.main,
    padding: "10px",
    width: theme.spacing(25),
    borderRadius: "5px",
    "&:hover": {
      backgroundColor: theme.palette.success.main,
    },
  },
}));

export default useStyles;
