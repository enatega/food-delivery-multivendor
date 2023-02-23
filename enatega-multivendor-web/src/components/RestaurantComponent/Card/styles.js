import makeStyles from '@mui/styles/makeStyles';

const useStyle = makeStyles((theme) => ({
  imageContainer: {
    width: "100%",
    height: "144px",
    position: "relative",
    overflow: "hidden",
  },
  imgContainer: {
    backgroundSize: "cover",
    backgroundPositionX: "50%",
    backgroundPositionY: "center",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  },
  timeText: {
    ...theme.typography.caption,
    fontSize: "0.5rem",
    textAlign: "center",
    lineHeight: "normal",
  },
  timeContainer: {
    padding: "5px 10px",
    backgroundColor: theme.palette.primary.light,
    position: "absolute",
    right: "0px",
    top: "0px",
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
  },
  subDescription: {
    color: theme.palette.text.disabled,
    overflow: "hidden",
    fontSize: "0.875rem",
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
    bottom: "5px",
    right: "5px",
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
    backgroundColor: "transparent",
    boxShadow: theme.shadows[0],
  },
}));

export default useStyle;
