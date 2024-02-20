import makeStyles from "@mui/styles/makeStyles";
import { useTheme } from "@mui/material";
import Restaurants from "../../../assets/images/restaurants.png";

const useStyle = makeStyles((theme) => {
  const currentTheme = useTheme();

  return {
    mainContainer: {
      padding: (extraSmall) => (extraSmall ? "5px" : "0px"),
      backgroundColor: currentTheme.palette.success.dark,
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
      backgroundColor: currentTheme.palette.success.dark, // Use currentTheme here
      height: 10,
    },
  };
});

export default useStyle;
