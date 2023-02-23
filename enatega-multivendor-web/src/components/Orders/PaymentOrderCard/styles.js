import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
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
  center: {
    justifyContent: "center",
    padding: theme.spacing(2, 3),
  },
  cardContainer: {
    background: theme.palette.common.white,
    borderRadius: 0,
  },
  dot: {
    fontSize: 10,
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(0.5),
  },
  imgContainer: {
    maxWidth: "158px",
    backgroundSize: "cover",
  },
  disabledText: {
    color: theme.palette.text.disabled,
  },
  textBold: {
    fontWeight: 700,
  },
  smallText: {
    fontSize: "0.875rem",
  },
  cardRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(0.1, 0),
  },
  btnBase: {
    borderRadius: "0px",
  },
}));

export default useStyles;
