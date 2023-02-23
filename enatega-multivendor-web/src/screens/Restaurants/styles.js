import makeStyles from "@mui/styles/makeStyles";
import bg from "../../assets/images/img-map-background.jpeg";

const useStyles = makeStyles((theme) => ({
   marginHeader: {
      marginTop: "200px",
   },
   spinnerContainer: {
      flexDirection: "row",
      display: "flex",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: "100px",
   },
   mapGrid: {
      height: "200px",
      width: "100%",
   },
   mapImage: {
      backgroundImage: `url(${bg})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      marginLeft: "8%",
      marginTop: "20px",
      height: "150px",
      width: "80%",
      borderRadius: "10px",
   },
   mapText: {
      marginLeft: "20px",
      marginTop: "20px",
   },
   mapButton: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: "bold",
      marginLeft: "20px",
      boxShadow: `0 0 5px ${theme.palette.grey[300]}`,
      "&:hover": {
         background: theme.palette.success.main,
      },
   },
}));

export default useStyles;
