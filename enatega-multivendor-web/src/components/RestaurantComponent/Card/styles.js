import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  imageContainer: {
    width: "100%",
    height: "144px",
    position: "relative",
    overflow: "hidden",
    borderRadius: 15,
  },
  imgContainer: {
    backgroundSize: "cover",
    backgroundPositionX: "50%",
    backgroundPositionY: "center",
    transition: "transform 0.2s",
    height: "100%",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  timeText: {
    ...theme.typography.caption,
    fontSize: "0.5rem",
    textAlign: "center",
    lineHeight: "normal",
    display: "inline",
    fontWeight: 700,
  },
  timeContainer: {
    padding: "5px 10px",
    backgroundColor: theme.palette.primary.light,
    position: "absolute",
    left: "10px",
    top: "10px",
    borderRadius: "0.75rem",
  },
  offText: {
    textAlign: "center",
    color: theme.palette.text.primary,
    fontWeight: 700,
  },
  offContainer: {
    padding: "5px 15px",
    backgroundColor: theme.palette.primary.main,
    position: "absolute",
    top: "10px",
  },
  textBold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  totalRatingText: {
    color: theme.palette.text.disabled,
    fontSize: "0.875rem",
  },
  subDescription: {
    color: theme.palette.text.disabled,
    overflow: "hidden",
    fontSize: "0.875rem",
    flex: 0.9,
  },
  priceText: {
    fontWeight: 700,
    fontSize: "0.875rem",
  },
  priceDescription: {
    color: theme.palette.text.disabled,
    fontSize: "0.875rem",
  },
  heartBtn: {
    minWidth: "36px",
    height: "36px",
    borderRadius: "18px",
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      backgroundColor: theme.palette.common.white,
    },
    "&:disabled": {
      backgroundColor: theme.palette.common.white,
    },
  },
  smallHeartBtn: {
    minWidth: "30px",
    height: "30px",
    borderRadius: "18px",
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    top: "10px",
    right: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      backgroundColor: theme.palette.common.white,
    },
    "&:disabled": {
      backgroundColor: theme.palette.common.white,
    },
  },
  card: {
    backgroundColor: "white",
    boxShadow: theme.shadows[0],
    borderRadius: 25,
    padding: 8,
  },
  icon: {
    color: "black",
  },
  row: {
    marginTop: 10,
    width: "90%",
    margin: "auto",
  },
  largeWidth: {
    minWidth: "200px",
  },
  smallWidth: {
    width: "200px",
    [theme.breakpoints.down("md")]: {
      width: "150px",
    },
  },
}));

export default useStyle;
