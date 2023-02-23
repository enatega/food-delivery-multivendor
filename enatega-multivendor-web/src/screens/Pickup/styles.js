import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
   marginHeader: {
      marginTop: "100px",
   },
   rowReverse: {
      display: "flex",
      flexDirection: "row-reverse",
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
      height: "700px",
      width: "100%",
      overflow: "hidden",
   },
   restaurants: {
      height: "700px",
      overflow: "scroll",
   },
   btn: {
      zIndex: 1,
      marginLeft: "40%",
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontWeight: "bold",
      boxShadow: `0 0 5px ${theme.palette.grey[300]}`,
      "&:hover": {
         background: theme.palette.success.main,
      },
   },
   cardFocus: {
      boxShadow: `0 0 10px ${theme.palette.grey[300]}`,
      border: `2px solid ${theme.palette.primary.main}`,
   },
}));

export default useStyles;
