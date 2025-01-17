import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
   mainContainer: {
        display:"flex",
        justifyContent:"center",
        flexDirection:"column",
        height:"auto",
        marginTop:"80px",
        marginBottom:"80px",
        width:"80%",
        margin:"0 auto"
    },
    mainText:
    {
        fontWeight:"400",
        marginBottom:"20px",
        textAlign:"center",
        fontSize:"40px"
    },
    secondaryText:{
        fontSize:"20px",
        lineHeight:"25px",
        color:"#667085",
        marginBottom:"30px"
    },
    greenButton:{
     backgroundColor:"#5AC12F",
     margin:"4px",
    //  width:"240px",
     '&:hover' :{
      backgroundColor:"white",
      color:"black",
      border:"1px solid #5AC12F",
     }
    },
    yellowButton:{
    backgroundColor:"#FF9900",
    // width:"240px",
    margin:"4px",
    '&:hover' :{
      backgroundColor:"white",
      color:"black",
      border:"1px solid #FF9900"
     }
    },
    blueButton:{
        backgroundColor:"#007BFF",
        margin:"4px",
        // width:"240px",
      '&:hover' :{
      backgroundColor:"white",
      color:"black",
      border:"1px solid #007BFF"
     }

    },

}));

export default useStyle;
