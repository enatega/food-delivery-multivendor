import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  restaurantTitle: {
    ...theme.typography.h6,
    color: theme.palette.common.white,
    fontWeight: 700,
  },
  tagStyles: {
    ...theme.typography.caption,
    color: theme.palette.common.white,
    fontWeight: 700,
  },
  tagContainer: {
    backgroundColor: theme.palette.primary.main,
    display: "inline-block",
    padding: "2px 8px",
  },
  closeContainer: {
    backgroundColor: theme.palette.warning.light,
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "8px",
  },
  closeTag: {
    color: theme.palette.common.black,
    fontWeight: 700,
  },
  currentRatingText: {
    ...theme.typography.caption,
    fontWeight: 700,
    color: theme.palette.common.white,
    fontSize: "0.875rem",
  },
  totalRatingText: {
    ...theme.typography.caption,
    color: theme.palette.common.white,
    fontSize: "0.875rem",
  },
  categoriesStyle: {
    color: theme.palette.common.white,
  },
}));

export default useStyle;
