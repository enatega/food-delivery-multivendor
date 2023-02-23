import makeStyles from '@mui/styles/makeStyles';

const useStyle = makeStyles((theme) => ({
  restaurantTitle: {
    ...theme.typography.h6,
    color: theme.palette.text.secondary,
    fontWeight: 700,
  },
  tagStyles: {
    ...theme.typography.caption,
    color: theme.palette.primary.light,
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
    color: theme.palette.text.secondary,
  },
  totalRatingText: {
    ...theme.typography.caption,
    color: theme.palette.text.disabled,
  },
}));

export default useStyle;
