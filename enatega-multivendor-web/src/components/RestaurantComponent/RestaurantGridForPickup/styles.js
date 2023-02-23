import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
   mainContainer: {
      marginTop: "50px",
      padding: (extraSmall) => (extraSmall ? "0px  5vw" : "0px"),
   },
   card: {
      "&:hover": {
         boxShadow: `0 0 10px ${theme.palette.grey[300]}`,
         border: `2px solid ${theme.palette.primary.main}`,
      },
      "&:focus": {
         boxShadow: `0 0 10px ${theme.palette.grey[300]}`,
         border: `2px solid ${theme.palette.primary.main}`,
      },
   },
}));

export default useStyle;
