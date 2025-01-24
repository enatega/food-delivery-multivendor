import makeStyles from '@mui/styles/makeStyles';

const useStyle = makeStyles((theme) => ({
    container:
    {
        margin:"0 auto",
        marginTop:"60px",
        marginBottom:"60px"
        
    },
    mainContainer:
    {
        marginBottom:"60px",
        marginTop:"80px"
    },
    heading:
    {
        fontSize:"32px",
        lineHeight:"40.48px",
        fontWeight:"600",
        marginBottom:"20px"
    },
    buttonContainer:{
        display:"flex",
        gap:10
    },
    button:
    {
        textDecoration:"none",
        padding:"8px",
        borderRadius:"4px",
        cursor:"pointer"
    }
   
}));

export default useStyle;
