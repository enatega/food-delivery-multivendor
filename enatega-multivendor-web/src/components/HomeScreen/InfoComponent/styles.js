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
        // fontSize:"48px"
        fontWeight:"500",
        marginBottom:"20px"
    },
    secondaryText:{
        fontSize:"20px",
        lineHeight:"25px",
        color:"#667085",
        marginBottom:"30px"
    },
    greenButton:{
     backgroundColor:"#5AC12F",
     margin:"4px"
    },
    yellowButton:{
    backgroundColor:"#FF9900",
    margin:"4px"
    },
    blueButton:{
        backgroundColor:"#007BFF",
        margin:"4px"

    }

}));

export default useStyle;
