import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  text:{
    color:"#667085",
    fontWeight:"400"
  },
  head:
  {
   color:"black",
   fontWeight:"600",
   fontSize:"16px",
   lineHeight:"30px"
  },
  main:{
    marginBottom:"12px"
  },
  logo:{
    marginRight:"5px",
    borderRadius:"12px",
    padding:"1px"
  }
    
}));

export default useStyle;
