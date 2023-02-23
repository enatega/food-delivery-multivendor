import makeStyles from '@mui/styles/makeStyles';

const useStyle = makeStyles((theme) => ({
  root: {
    "& .MuiDialog-paper": {
      padding: theme.spacing(1, 1),
    },
    "& .MuiButton-containedPrimary:hover": {
      backgroundColor: theme.palette.primary.main,
    },
    "& .MuiButton-outlinedPrimary": {
      margin: theme.spacing(1, 1),
    },
  },
  MB2: {
    marginBottom: theme.spacing(2),
  },
  lightText: {
    fontWeight: theme.typography.fontWeightLight,
  },
  boldText: {
    fontWeight: theme.typography.fontWeightBold,
  },
  disabledText: {
    color: theme.palette.text.disabled,
  },
  titleText: {
    ...theme.typography.h6,
    color: theme.palette.text.disabled,
  },
  xSmallText: {
    ...theme.typography.caption,
    color: theme.palette.text.disabled,
  },
  smallText: {
    ...theme.typography.body2,
    color: theme.palette.text.disabled,
    fontSize: "0.875rem",
  },
  btnBase: {
    borderRadius: "0px",
    height: "50px",
  },
  linkBtn: {
    textDecoration: "none",
  },
  closeContainer: {
    position: "absolute",
    background: "rgba(0,0,0,0.1)",
    top: theme.spacing(1),
    right: theme.spacing(1),
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.3)",
    },
  },
}));

export default useStyle;
