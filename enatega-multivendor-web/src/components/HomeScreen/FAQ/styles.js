import makeStyles from '@mui/styles/makeStyles';

const useStyle = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    marginTop: "50px",
    marginBottom: "120px",
  },
  headingContainer: {
    display: "flex",
  },
  FAQTitle: {
    fontWeight: "bold",
    width: "100%",
  },
  FAQAns: {
    margin: theme.spacing(3, 0),
    color: theme.palette.secondary.light,
    fontWeight: "300",
    width: "100%",
  },
  btnTransparent: {
    borderRadius: "0px",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  btnText: {
    width: "100%",
    fontWeight: "300",
    textTransform: "none",
    color: theme.palette.secondary.light,
  },
  btnBase: {
    borderRadius: "0px",
    height: "55px",
    marginRight: "10px",
  },
}));

export default useStyle;
