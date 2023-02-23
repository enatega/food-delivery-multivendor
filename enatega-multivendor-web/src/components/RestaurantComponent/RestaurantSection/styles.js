import makeStyles from '@mui/styles/makeStyles';

const useStyle = makeStyles((theme) => ({
  restauranCardContainer: {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  nextButtonStyles: {
    minWidth: "auto",
    width: "40px",
    height: "50px",
    position: "absolute",
    top: "100px",
    backgroundColor: theme.palette.primary.main,
    zIndex: 5,
    borderRadius: "inherit",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  mainContainer: {
    marginTop: "50px",
    padding: (extraSmall) => (extraSmall ? "0px  5vw" : "0px"),
  },
}));

export default useStyle;
