import makeStyles from '@mui/styles/makeStyles';

const useStyle = makeStyles((theme) => ({
  mainContainer: {
    marginTop: "50px",
    padding: (extraSmall) => (extraSmall ? "0px  5vw" : "0px"),
  },
}));

export default useStyle;
