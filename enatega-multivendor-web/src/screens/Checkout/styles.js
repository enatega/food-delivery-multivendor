import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.grey[100],
  },
  mt2: {
    marginTop: theme.spacing(2),
  },
  PV3: {
    padding: theme.spacing(3, 0),
  },
  contentContainer: {
    padding: theme.spacing(0, 3),
  },
  mainContainer: {
    marginTop: "70px",
    padding: theme.spacing(6, 0),
    background: theme.palette.grey[100],
  },
  center: {
    justifyContent: "center",
  },
  spinnerContainer: {
    flexDirection: "row",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  title: {
    fontWeight: theme.typography.fontWeightLight,
    fontSize: "3rem",
    color: theme.palette.secondary.light,
  },
  textBold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  disableText: {
    color: theme.palette.text.disabled,
  },
  smallText: {
    fontSize: "0.875rem",
  },
  btnBase: {
    borderRadius: "0px",
    height: "50px",
  },
  heartBG: {
    display: "flex",
    backgroundColor: theme.palette.common.white,
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 15,
    boxShadow: theme.shadows[5],
  },
  link: {
    textDecoration: "none",
  },
  paymentInfoBtn: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: theme.spacing(1),
    marginTop: theme.spacing(4),
    border: `1px solid ${theme.palette.grey[300]}`,
  },
}));

export default useStyles;
