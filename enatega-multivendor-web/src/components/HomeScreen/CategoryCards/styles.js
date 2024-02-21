import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  container: {
    width: "340px",
    height: "300px",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    marginBottom: "10px",
    [theme.breakpoints.down("md")]: {
      width: "260px",
    },
  },
  top: {
    height: "45%",
    backgroundColor: theme.palette.common.white,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  bottom: {
    height: "55%",
    backgroundColor: "#3C8F7C",
    display: "flex",
    flexDirection: "column",
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
    width: 90,
    height: "auto",
  },
  imageWeb: {
    position: "absolute",
    top: "-50%",
    left: "50%",
    padding: 0,
    margin: 0,
    transform: "translate(-50%, 30%)",
    width: "225px",
    height: "auto",
  },
}));

export default useStyle;
