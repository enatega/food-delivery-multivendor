import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginBottom: theme.spacing(3),
    },
    "& .MuiInputBase-input": {
      color: theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.grey[200],
      },
      "&:hover fieldset": {
        borderColor: theme.palette.text.disabled,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiButton-contained": {
      borderRadius: "0px",
      height: "50px",
      "&:hover": {
        opacity: 0.8,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  marginHeader: {
    marginTop: "200px",
  },
}));

export default useStyles;
