import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  root: {
    "& .MuiInput-root": {
      marginLeft: "10px",
      caretColor: theme.palette.primary.main,
      color: theme.palette.text.secondary,
    },
  },
  mt: {
    marginTop: theme.spacing(6),
  },
  searchContainer: {
    //padding: (extraSmall) => (extraSmall ? "0px  5vw" : "0px"),
    boxShadow: "0px 0px 20px 1px rgba(0,0,0,0.2)",
  },
}));

export default useStyle;
