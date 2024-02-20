import makeStyles from "@mui/styles/makeStyles";
import { useTheme } from "@mui/material";
import Bg from "../../assets/images/bg-invert.png";

const useStyles = makeStyles((theme) => {
  const currentTheme = useTheme();

  return {
    root: {
      background: theme.palette.grey[100],
    },
    mt2: {
      marginTop: theme.spacing(2),
    },
    PV3: {
      padding: theme.spacing(3, 0),
    },
    contentContainer: {
      padding: theme.spacing(0, 3),
    },
    mainContainer: {
      marginTop: "-10px",
      background: theme.palette.grey[100],
      backgroundImage: `url(${Bg})`,
      backgroundPositionX: "left",
      backgroundPositionY: "bottom",
      backgroundSize: "400px",
      backgroundRepeat: "no-repeat",
    },
    center: {
      justifyContent: "center",
    },
    spinnerContainer: {
      flexDirection: "row",
      display: "flex",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    title: {
      fontWeight: theme.typography.fontWeightLight,
      fontSize: "3rem",
      color: theme.palette.secondary.light,
    },
    textBold: {
      fontWeight: theme.typography.fontWeightBold,
    },
    disableText: {
      color: theme.palette.text.disabled,
    },
    smallText: {
      fontSize: "0.875rem",
    },
    btnBase: {
      borderRadius: "0px",
      height: "50px",
    },
    heartBG: {
      display: "flex",
      backgroundColor: currentTheme.palette.common.white,
      alignItems: "center",
      justifyContent: "center",
      width: 30,
      height: 30,
      borderRadius: 15,
      boxShadow: theme.shadows[5],
    },
    link: {
      textDecoration: "none",
    },
    paymentInfoBtn: {
      width: "100%",
      height: "100%",
      justifyContent: "space-between",
      padding: theme.spacing(1),
      marginTop: theme.spacing(4),
      border: `1px solid ${theme.palette.grey[300]}`,
    },
    containerCard: {
      marginTop: "-90px",
      zIndex: 99,
    },
    headerBar: {
      background: "linear-gradient(260.99deg, #90EA93 2.79%, #6FCF97 96.54%)",
      borderRadius: "20px",
      padding: "30px 20px",
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

    divider: {
      width: "75%",
      background: "black",
      margin: `${theme.spacing(2)} auto`,
    },
    deliveryPaperProfile: {
      background: theme.palette.primary.main,
      borderRadius: 10,
      cursor: "pointer",
      border: "none",
    },
    closeContainer: {
      position: "absolute",
      background: "black",
      top: theme.spacing(1),
      right: theme.spacing(1),
      "&:hover": {
        backgroundColor: "black",
      },
    },
    footerContainer: {
      width: "100%",
      background: theme.palette.grey[100],
    },
    footerWrapper: {
      backgroundColor: theme.palette.primary.main,
      width: "90%",
      display: "flex",
      marginLeft: "auto",
      borderTopLeftRadius: "5rem",
      borderBottomLeftRadius: "5rem",
    },
  };
});

export default useStyles;
