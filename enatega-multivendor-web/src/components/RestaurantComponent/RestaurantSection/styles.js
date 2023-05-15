import makeStyles from "@mui/styles/makeStyles";

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
    top: "50%",
    zIndex: 5,
    borderRadius: "inherit",

    [theme.breakpoints.down("md")]: {
      zIndex: -999,
    },
  },
  mainContainer: {
    padding: (extraSmall) => (extraSmall ? "0px  2vw" : "0px"),
    marginBottom: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  divider: {
    width: "165px",
    backgroundColor: "#448B7B",
    height: 10,
  },
}));

export default useStyle;
