import makeStyles from '@mui/styles/makeStyles';

const useStyle = makeStyles((theme) => ({
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
  itemTitle: {
    ...theme.typography.h5,
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
  priceTitle: {
    ...theme.typography.subtitle2,
    color: theme.palette.text.disabled,
  },
  infoStyle: {
    ...theme.typography.caption,
    textTransform: "uppercase",
    background: "rgba(39,111,191,0.1)",
    color: "#276FBF",
    padding: "4px 6px",
    fontWeight: 700,
  },
  checkoutContainer: {
    borderRadius: 0,
    width: "80%",
    padding: "10px 0px",
    "&:hover": {
      background: theme.palette.primary.main,
    },
  },
  checkoutText: {
    ...theme.typography.h6,
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  closeContainer: {
    background: theme.palette.grey[300],
    minWidth: "auto",
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    borderRadius: "50%",
    padding: theme.spacing(1),
  },
  itemError: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.warning.main,
  },
  disableBtn: {
    background: theme.palette.grey[400],
    "&:hover": {
      background: theme.palette.grey[400],
    },
  },
}));

export default useStyle;
