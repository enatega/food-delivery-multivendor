import makeStyles from "@mui/styles/makeStyles";
import Restaurants from "../../../assets/images/restaurants.png";

const useStyle = makeStyles((theme) => ({
  mainContainer: {
    padding: (extraSmall) => (extraSmall ? "5px" : "0px"),
    backgroundColor: "#F0F0F0",
    position: "relative",
    minHeight: "100vh",
    backgroundImage: `url(${Restaurants})`,
    backgroundSize: "contain",
    backgroundPosition: "right",
    backgroundRepeat: "no-repeat",
  },
  bgImage: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: -9,
  },
  divider: {
    width: "180px",
    backgroundColor: "#448B7B",
    height: 10,
  },
}));

export default useStyle;
