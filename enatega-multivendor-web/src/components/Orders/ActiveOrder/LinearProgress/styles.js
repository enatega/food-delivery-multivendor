import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  linearProgress: {
    width: (extraSmall) => (extraSmall ? theme.spacing(4) : theme.spacing(6)),
  },
  bar: {
    borderRadius: 10,
  },
}));

export default useStyles;
