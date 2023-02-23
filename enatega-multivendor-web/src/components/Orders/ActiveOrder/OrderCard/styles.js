import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  mt: {
    marginTop: theme.spacing(4),
  },
  box: {
    padding: "20px",
    background: theme.palette.common.white,
    borderRadius: 0,
    boxShadow: `0px 1px 20px 1px ${theme.palette.grey[300]}`,
  },
  textBold: {
    fontWeight: 700,
  },
  link: {
    textDecoration: "none",
  },
}));

export default useStyles;
