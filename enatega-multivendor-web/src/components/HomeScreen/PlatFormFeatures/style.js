import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
        
    mainContainer:{
        backgroundColor:"black",
      
        color:"white",
        paddingTop:"80px",
        paddingBottom:"80px"
    },
    container:
    {
        width:"100%",
        height:"100%",
        margin:"0 auto",
    },
    header:
    {
     fontWeight:"500",
     fontSize:"52px",
     lineHeight:"68px",
     letterSpacing:"-1px"
    },
    text:
    {
     fontWeight:"400",
     fontSize:"16px",
     lineHeight:"23px",
     color:"#94A3B8"
    }
  }));

export default useStyle;
