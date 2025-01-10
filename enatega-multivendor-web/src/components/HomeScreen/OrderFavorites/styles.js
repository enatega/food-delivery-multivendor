import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  
    mainBox:
    {
      backgroundColor:"#5AC12F", 
      overflow:"none" 
    },
    head:
    {
        color:"white",
        fontWeight:"600",
        fontSize:"22px",
        lineHeight:"30.36px"
    },
    text:{
        color:"white",
        marginTop:"20px",
        fontSize:"16px",
        fontWeight:"500"
    },
    container:
    {
        margin:"0 auto",
        position:"relative",
        paddingTop:"20px",
        paddingBottom:"20px"
    },

    phoneImg:
    {
        // transform:"rotate(6.49deg)"
    }
  
}));

export default useStyle;
