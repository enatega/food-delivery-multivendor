import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
    mainContainer:
    {
        backgroundColor:"#F8FAFC",
        paddingTop:"50px",
        paddingBottom:"50px"
    },
    container:
    {
        margin:"0 auto",
        
    },
    mainText:
    {
     fontWeight:"400",
     fontSize:"45px",
     lineHeight:"58px",
     marginBottom:"12px",
    },
    secondaryText:
    {
      color:"#667085",
      fontSize:"20px",
      lineHeight:"30px",
      marginBottom:"20px"
    },
    joinContainer:
    {
        padding:"10px"
    }
  
}));

export default useStyle;
