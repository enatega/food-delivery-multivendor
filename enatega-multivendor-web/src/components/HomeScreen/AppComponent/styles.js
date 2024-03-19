import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.primary.main,
    minHeight: 300,
    borderRadius: 40,
    display: "flex",
    zIndex: 999,
    position: "relative",
  },
  fontContainer: {
    fontWeight: 400,
    marginTop: 10,
    maxWidth: "340px",
    fontSize: "15px",
    marginRight: "2%",
  },
  btn: {
    backgroundColor: theme.palette.button.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.button.main,
    },
  },
  img2: {
    height: "auto",
    maxWidth: "100%",
    marginTop: "3rem",
    width: 220,
  },
  img1: {
    maxWidth: "100%",
    height: "auto",
    width: 220,
  },
  bgText: {
    position: "absolute",
    top: -130,
    left: -30,
    fontSize: 150,
    fontWeight: 500,

    color: theme.palette.common.black,
    mixBlendMode: "normal",
    opacity: 0.24,
    zIndex: -99999,
  },
  bgTextSmall: {
    position: "absolute",
    top: -70,
    left: -20,
    fontSize: 100,
    fontWeight: 500,

    color: theme.palette.common.black,
    mixBlendMode: "normal",
    opacity: 0.24,
    zIndex: -99999,
  },
}));

export default useStyle;
