import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    paddingTop: "70px",
    minWidth: "100%",
    backgroundColor: "transparent",
    color: theme.palette.secondary.light,
  },
  imageContainer: {
    width: "100%",
    height: "400px",
    backgroundImage:
      "url(https://images.deliveryhero.io/image/foodpanda/cms-hero.jpg?width=2000&height=500|https://images.deliveryhero.io/image/foodpanda/cms-hero.jpg?width=4000&height=1000)",
    backgroundSize: "cover",
    backgroundPositionX: "50%",
    backgroundPositionY: "center",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
    textTransform: "uppercase",
  },
  linkDecoration: {
    textDecoration: "none",
    alignSelf: "center",
  },
  link: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: 600,
    fontSize: "1rem",
  },
  bullet: {
    listStyleType: "disc",
    margin: theme.spacing(3, 0),
  },
  circle: {
    listStyleType: "circle",
  },
  MV3: {
    width: "100%",
    margin: theme.spacing(3, 0),
  },
  MV2: {
    margin: theme.spacing(2, 0),
  },
}));

export default useStyles;
