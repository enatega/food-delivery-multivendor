import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  
    mainBox:
    {
      backgroundColor:"#5AC12F",
      padding:"20px"
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
    },
    stores:
    {
        marginRight:"20px",
        marginTop:"10px",
        backgroundColor:"white",
        padding:0,
        "&:hover":
        {
         backgroundColor:"white"
        }
    
    },
    phoneImg:
    {
        width: "520px",
        height: "500px",

        [theme.breakpoints.down("sm")]: {
             width:"100%",
             height:"auto",
            
        },
    }

}));

export default useStyle;
