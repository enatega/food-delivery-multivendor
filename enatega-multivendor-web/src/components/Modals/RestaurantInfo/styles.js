import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  imgContainer: {
    height: "200px",
    width: "100%",
    backgroundImage: `url('https://images.deliveryhero.io/image/fd-pk/LH/v6ai-hero.jpg?width=2000&amp;height=500')`,
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
  },
  line: {
    margin: theme.spacing(2, 0),
  },
  lightText: {
    fontWeight: theme.typography.fontWeightBolder,
  },
  restaurantContainer: {
    background: theme.palette.common.white,
    marginTop: "-50px",
    paddingLeft: "0px",
    paddingRight: "0px",
    boxShadow: theme.shadows[1],
  },
  titleText: {
    ...theme.typography.h6,
    color: theme.palette.text.disabled,
  },
  xSmallText: {
    ...theme.typography.caption,
    color: theme.palette.text.disabled,
  },
  smallText: {
    ...theme.typography.body2,
    color: theme.palette.text.disabled,
    fontSize: "0.875rem",
  },
  reviewContainer: {
    backgroundColor: "black",
    padding: "12px",
    borderRadius: "10px",
    marginLeft: "10px",
    marginRight: "10px",
    marginBottom: "10px",
  },
  closeContainer: {
    position: "absolute",
    background: "rgba(0,0,0,0.1)",
    top: theme.spacing(1),
    right: theme.spacing(1),
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.3)",
    },
  },
  starIcon: {
    fontSize: "14px",
    color: theme.palette.info.main,
  },
  starSharp: {
    fontSize: "14px",
    color: theme.palette.warning.light,
  },
}));

export default useStyle;
