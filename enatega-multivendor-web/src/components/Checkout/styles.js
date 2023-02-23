import makeStyles from '@mui/styles/makeStyles';

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
    "& .MuiButton-outlined": {
      "& .MuiButton-label": {
        color: theme.palette.text.secondary,
      },
      borderRadius: "0px",
      margin: theme.spacing(0, 1),
      backgroundColor: "transparent",
      "&:hover": {
        "& .MuiButton-label": {
          color: theme.palette.text.primary,
        },
        backgroundColor: theme.palette.primary.main,
      },
    },
    "& .MuiButton-contained": {
      "& .MuiButton-label": {
        color: theme.palette.text.primary,
      },
      borderRadius: "0px",
      margin: theme.spacing(0, 1),
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  inputprops: {
    ...theme.typography.subtitle1,
    backgroundColor: theme.palette.grey[200],
  },
  couponBtn: {
    padding: theme.spacing(1, 0),
    alignSelf: "flex-end",
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
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  link: {
    textDecoration: "none",
  },
}));

export default useStyle;
