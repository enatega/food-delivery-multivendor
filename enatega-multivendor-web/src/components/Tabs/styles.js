import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
   marginHeader: {
      marginTop: "200px",
   },
   center: {
      flexDirection: "row",
      display: "flex",
      flex: 1,
      marginLeft: "9%",
   },
   box: {
      display: "flex",
      justifyContent: "space-between",
      width: 230,
      background: theme.palette.common.white,
      marginRight: 20,
      cursor: "pointer",
   },
   innerBox: {
      display: "flex",
      flexDirection: "column",
      background: theme.palette.common.white,
   },
   text: {
      marginTop: "35px",
      paddingLeft: "15px",
      color: theme.palette.primary.main,
      fontWeight: "bold",
   },
   image: {
      width: 120,
      height: 75,
   },
   activeTab: {
      borderBottom: `4px solid ${theme.palette.primary.main}`,
      boxShadow: `0 0 5px ${theme.palette.grey[300]}`,
   },
}));

export default useStyles;
