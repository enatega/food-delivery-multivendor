import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  infoText: {
    ...theme.typography.body1,
    color: theme.palette.text.disabled,
  },
  subtotalText: {
    ...theme.typography.body1,
    fontSize: "0.875rem",
  },
  checkoutContainer: {
    background: theme.palette.grey[400],
    borderRadius: 0,
    width: "100%",
    padding: "10px 0px",
    "&:hover": {
      background: theme.palette.grey[400],
    },
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
}));

export default useStyle;
