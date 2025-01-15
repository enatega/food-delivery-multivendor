import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "auto",
    margin: "50px auto",
  },
  imageContainer: {
    // padding: "20px",
    alignItems: 'center'
  },
  image: {
    width: "100%",
    height: "100%",
    margin: "0 auto",
    borderRadius: "15px",
     objectFit: "cover"
  },
  imgCont:{
    width: "100%",
    maxWidth: '705px',
    height: "100%",
    maxHeight: '483px',
    margin:"0 auto",
  }
  // smallerImage: {
  //   width: "80%",
  //   maxWidth: "400px",
  // },
  // imageText: {
  //   marginTop: theme.spacing(2),
  //   textAlign: "center",
  //   fontWeight: '500',
  // },
}));

export default useStyles;
