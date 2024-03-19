import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  container: {
    width: "300px",
    height: "570px",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      width: "275px",
    },
  },
  outsideBottom: {
    padding: "1.25rem",
    height: "55%",
    paddingTop: 0,
  },
  top: {
    backgroundColor: theme.palette.common.black,
    display: "flex",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  bottom: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  image: {
    position: "absolute",
    top: "-50%",
    left: "50%",
    padding: 0,
    margin: 0,
    transform: "translate(-50%, 30%)",
  },
}));

export default useStyle;
