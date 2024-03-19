import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      marginBottom: theme.spacing(3),
    },
    "& .MuiInputBase-input": {
      color: theme.palette.text.secondary,
    },
    "& .MuiDialog-paper": {
      backgroundColor: "transparent",
      borderRadius: 40,
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
    fontWeight: 500,
    color: theme.palette.text.secondary,
  },
  priceTitle: {
    ...theme.typography.subtitle2,
    color: theme.palette.text.disabled,
  },
  infoStyle: {
    ...theme.typography.caption,
    textTransform: "uppercase",
    background: "black",
    color: "white",
    padding: "4px 6px",
    fontWeight: 500,
    borderRadius: 10,
  },
  checkoutContainer: {
    width: "200px",
    borderRadius: "12px !important",
    padding: "10px 0px",
    "&:hover": {
      background: theme.palette.primary.main,
    },
  },
  imageContainer: {
    width: "100%",
    height: "180px",
    backgroundImage: `url('https://images.deliveryhero.io/image/fd-pk/LH/v1bq-hero.jpg?width=2000&amp;height=500')`,
    backgroundSize: "cover",
    backgroundPositionX: "center",
    backgroundPositionY: "center",
    position: "relative",
    borderRadius: 40,
    boxShadow:
      "inset 0 0 0 1000px rgba(0, 0, 0, 0), inset 0 0 0 1000px theme.palette.common.lightBlack",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutText: {
    ...theme.typography.h6,
    fontWeight: 700,
    fontSize: "0.875rem",
    color: theme.palette.common.black,
  },
  closeContainer: {
    background: theme.palette.common.white,
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    position: "absolute",
    right: 0,
    top: 0,
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
  outerContainer: {
    borderRadius: 40,
    background: "#F5F6F6",
  },
  innerContainer: {
    background: "#F5F6F6",
    padding: "20px 40px",
  },
  lowerContainer: {
    background: theme.palette.common.white,
    boxShadow: theme.shadows["2"],
    borderRadius: 20,
  },
  mr: {
    marginRight: theme.spacing(1),
  },
}));

export default useStyle;
