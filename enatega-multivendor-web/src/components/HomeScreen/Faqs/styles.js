import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  mainBox:
  {
    margin:"30px auto"
  },
  mainText:
  {
    textAlign:"center",
    fontSize:"32px",
    lineHeight:"40.48px",
    fontWeight:"600"
  },
  box:
  {
    textAlign:"center",
    width:"100%",
    marginTop:"40px",
    marginBottom:"40px"
  },
  accordSummary:
  {
    backgroundColor:"white",
    outline:"none",
    border:"1px solid #EBE9E9",

  },
  accord:
  {
    border:"none",
    outline:"none",
    marginBottom:"10px"
  },
  accordDetails:
  {
    backgroundColor:"white",
    textAlign:"left"


  }
}));

export default useStyle;
