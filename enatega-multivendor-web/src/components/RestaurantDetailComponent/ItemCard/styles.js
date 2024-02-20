import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  cardContainer: {
    margin: "20px 0px",
    backgroundColor: theme.palette.common.white,
  },
  itemContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "25px",
    cursor: "pointer",
    backgroundColor: theme.palette.common.white,
    borderRadius: 10
  },
  titleText: {
    paddingTop: "20px",
    paddingBottom: "20px",
  },
  boldText: {
    fontWeight: 700,
  },
  itemDesc: {
    color: theme.palette.text.disabled,
    fontSize: "0.875rem",
  },
  discountText: {
    color: theme.palette.text.disabled,
    fontWeight: theme.typography.fontWeightLight,
    fontSize: "0.875rem",
    textDecoration: "line-through",
    marginLeft: "5px",
  },
  imageContainer: {
    width: "88px",
    height: "88px",
    backgroundImage: `url('https://images.deliveryhero.io/image/fd-pk/Products/4387883.jpg')`,
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    position: "relative",
  },
  addContainer: {
    backgroundColor: theme.palette.primary.main,
    padding: "1px",
    borderRadius: "inherit",
    minWidth: "auto",
    position: "absolute",
    right: 0,
    bottom: 0,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default useStyle;
