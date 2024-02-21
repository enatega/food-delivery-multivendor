import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  root: {
    "& .MuiInputBase-input": {
      color: theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: theme.palette.text.disabled,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiButton-contained": {
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  flex: {
    flex: 1,
  },
  width100: {
    width: "100%",
  },
  PH1: {
    padding: theme.spacing(0, 1),
  },
  PB2: {
    paddingBottom: theme.spacing(2),
  },
  PT2: {
    paddingTop: theme.spacing(2),
  },
  MV1: {
    margin: theme.spacing(1, 0),
  },
  MV2: {
    margin: theme.spacing(2, 0),
  },
  smallText: {
    fontSize: "0.875rem",
  },
  wieght300: {
    fontWeight: 300,
  },
  disableText: {
    color: theme.palette.text.disabled,
  },
  boldText: {
    fontWeight: theme.typography.fontWeightBold,
  },
  deliveryPaper: {
    background: theme.palette.common.white,
    boxShadow: theme.shadows[0],
    cursor: "pointer",
  },
  shadow: {
    boxShadow: theme.shadows[0],
  },
  deliveryPaperProfile: {
    background: theme.palette.primary.main,
    borderRadius: 10,
    cursor: "pointer",
    border: "none",
  },
  containerBox: {
    background: theme.palette.common.white,
    padding: theme.spacing(2, 0),
  },

  redBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    backgroundColor: theme.palette.primary.main,
  },
  totalSmall: {
    fontSize: ".7rem",
    display: "flex",
    alignItems: "flex-end",
  },
  textContainer: {
    minWidth: "75%",
    "& .MuiInputBase-input": {
      color: theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: theme.palette.text.disabled,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
  },
  tipRow: {
    "& .MuiButton-root.MuiButton-outlined": {
      borderRadius: "0px",
      margin: theme.spacing(0, 1),
      backgroundColor: "transparent",
      "& .MuiButton-label": {
        color: theme.palette.text.secondary,
      },
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        "& .MuiButton-label": {
          color: theme.palette.primary.main,
        },
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiButton-root.MuiButton-contained": {
      borderRadius: "0px",
      margin: theme.spacing(0, 1),
      backgroundColor: theme.palette.primary.main,
      "& .MuiButton-label": {
        color: theme.palette.text.primary,
      },
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },

  inputprops: {
    ...theme.typography.subtitle1,
    backgroundColor: theme.palette.grey[200],
    borderRadius: 30,
  },
  couponBtn: {
    padding: theme.spacing(1, 0),
    alignSelf: "flex-end",
    width: 200,
    borderRadius: 20,
    margin: theme.spacing(2, 0),
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  addressBox: {
    boxShadow: theme.shadows[5],
    paddingBottom: theme.spacing(2),
  },
  deliveryBox: {
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  selectedDeliveryBox: {
    borderColor: theme.palette.primary.main,
  },
  wieght600: {
    fontWeight: 6000,
  },
  btnBase: {
    borderRadius: "0px",
    height: "50px",
  },
  paymentInfoBtn: {
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
    padding: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  link: {
    textDecoration: "none",
  },
  saveBtn: {
    backgroundColor: theme.palette.secondary.darkest,
    width: 120,
    borderRadius: 10,
    padding: 0,
    opacity: 1,
    transition: "opacity 0.3s",
    "&:hover": {
      backgroundColor: theme.palette.secondary.darkest,
      opacity: 0.7,
    },
  },
  largeText: {
    fontSize: "1.775rem",
    fontWeight: 800,
  },
  infoText: {
    ...theme.typography.body1,
    color: theme.palette.text.disabled,
  },
  subtotalText: {
    ...theme.typography.body1,
    fontSize: "0.875rem",
  },

  mobileCartText: {
    width: "130px",
    fontWeight: 100,
  },
  whiteText: {
    color: theme.palette.common.white,
  },
  disabledText: {
    color: theme.palette.text.disabled,
  },
  textBold: {
    fontWeight: theme.typography.fontWeightBold,
  },
  mediumFont: {
    fontSize: "1rem",
  },
  smallFont: {
    fontSize: "0.875rem",
  },
  checkoutText: {
    ...theme.typography.h6,
    fontWeight: 700,
    fontSize: "0.875rem",
  },
  totalText: {
    ...theme.typography.body1,
    fontSize: "0.875rem",
    fontWeight: 700,
    color: theme.palette.text.secondary,
  },
  itemTextStyle: {
    ...theme.typography.body1,
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
  optionTextStyle: {
    ...theme.typography.body1,
    color: theme.palette.primary.main,
  },
  border: {
    borderBottom: `1px solid ${theme.palette.grey[500]}`,
  },
  darkGreen: {
    color: theme.palette.button.main,
  },
  closeContainer: {
    position: "absolute",
    background: "black",
    top: theme.spacing(-1),
    right: theme.spacing(-1),
    "&:hover": {
      backgroundColor: "black",
    },
  },
  addressBtn: {
    padding: theme.spacing(1, 0),
    alignSelf: "flex-end",
    width: 200,
    borderRadius: 20,
    margin: theme.spacing(2, 0),
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  timeContainer: {
    backgroundColor: theme.palette.grey[200],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    marginTop: "10px",
    marginBottom: "10px",
    //marginRight: "50px",
    borderRadius: 20,
    flexDirection: "column",
  },
  divider: {
    backgroundColor: theme.palette.common.black,
    width: "85%",
    height: "0.5px",
  },
  btn: {
    width: 120,
    borderRadius: 20,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
  whiteBox: {
    background: theme.palette.common.white,
    borderRadius: 10,
    padding: 10,
  },
  textInput: {
    border: "none",
    width: "70px",
    textAlign: "center",
    height: "70px",
    fontSize: "3rem",
  },
  cal: {
    background: theme.palette.grey[200],
    borderRadius: 10,
    color: "black",
    "& .react-calendar__tile--active": {
      background: theme.palette.primary.main,
      color: "black",
      borderRadius: 10,
    },
    "& .react-calendar__navigation button": {
      fontWeight: 700,
    },
  },
}));

export default useStyle;
