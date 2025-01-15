import { makeStyles } from "@mui/styles";
import Partner_banner from '../../../src/assets/images/Partner_banner.png'
import step_line from '../../../src/assets/images/stepper-Line 1.png'

const useStyle = makeStyles(theme => ({
    heroSection: {
        backgroundImage: `url(${Partner_banner})`,
        height: '350px',
        width: '100%',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        marginTop: '64px',
        marginBottom: '91px',
    },
    heroTextBanner: {
        padding: '130px 0',
        [theme.breakpoints.down("sm")]: {
            padding: '115px 0',
        },
        "& h2": {
            fontSize: '54px',
            fontWeight: '600 ',
            color: '#fff',
            [theme.breakpoints.down("sm")]: {
                fontSize: '40px',
                marginBottom: '10px',
            },
        },
        "& p": {
            color: '#fff'
        }
    },
    businessBox: {
        marginBottom: '91px',
    },
    businessImage: {
        width: '100%',
        // height: '300px',
        [theme.breakpoints.down("md")]: {
            padding: '16px',
            // height: '359px',
        },
        [theme.breakpoints.down("md")]: {
            padding: '16px',
            paddingRight: '32px',
            // height: '359px',
        },
        "& img": {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        }
    },
    businessTextBox: {
        marginLeft: '45px',
        [theme.breakpoints.down("md")]: {
            marginLeft: '0px',
            padding: '16px',
        },
    },
    businessTitle: {
        "& h3": {
            fontSize: "32px",
            fontWeight: "600",
            color: theme.palette.common.bgColor,
            [theme.breakpoints.down("sm")]: {
                fontSize: '20px',
            },
        },
        "& p": {
            fontSize: '18px',
            fontWeight: '400',
            margin: '16px 0',
            color: theme.palette.grey["600"],
            [theme.breakpoints.down("sm")]: {
                fontSize: "14px",
            },
        }
    },
    businessBtn: {
        "& .MuiButton-root": {
            backgroundColor: theme.palette.common.bgColor,
            fontSize: '14px',
            fontWeight: '400',
            color: theme.palette.primary.light,
            marginTop: '20px',
            textTransform: 'capitalize',
            '&:hover': {
                backgroundColor: theme.palette.common.bgLight,
            },
            [theme.breakpoints.up("md")]: {
                marginTop: '5px',
            },
        }
    },
    growBusinessTitle: {
        "& h3": {
            fontSize: "32px",
            fontWeight: "600",
            color: theme.palette.common.bgColor,
            [theme.breakpoints.down("sm")]: {
                fontSize: '20px',
            },
        },
        "& p": {
            fontSize: '18px',
            fontWeight: '400',
            color: theme.palette.grey["600"],
            [theme.breakpoints.down("sm")]: {
                fontSize: "14px",
            },
        }
    },
    growList: {
        marginTop: '40px',

        "& li": {
            display: "flex",
            alignItems: "center",
            gap: '10px',
            marginLeft: '45px',
            [theme.breakpoints.down("lg")]: {
                marginLeft: '20px',
            },
            [theme.breakpoints.down("md")]: {
                marginLeft: '0',
            },
            "& p": {
                color: theme.palette.grey["600"],
                fontSize: '16px',
                [theme.breakpoints.down("sm")]: {
                    fontSize: "14px",
                },
            }
        },
    },
    restaurant_Box: {
        backgroundColor: "#fff",
        borderRadius: "10px",
        border: "1px solid #e8e8e8",
        transition: "all 0.5s ease",
        position: 'relative',
        "&:hover": {
            boxShadow: "0 8px 30px #00000026",
            "& img": {
                // transform:'scale(1.1)'
            },
        },
    },
    restaurant_img_box: {
        position: "relative",
        overflow: "hidden",
        transition: "all 0.5s ease",
        height: '180px',
        "& img": {
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            transition: "all 0.5s ease",
            objectFit: 'cover',
        },
        "&:before": {
            content: '""',
            width: "100%",
            height: "100%",
            background:
                "linear-gradient(179deg, #eeeeee00 0%, #0000008a 65%, #000000 100%) 0% 0% no-repeat padding-box",
            position: "absolute",
            top: 0,
            left: 0,
        },
    },
    restaurant_card_content_box: {
        borderBottom: "1px solid #ddd",
        marginTop: "35px",
        padding: "12px",
        "& h3": {
            fontSize: "18px",
            color: "#333",
            fontWeight: "600",
            marginBottom: "10px",
            //color: "#1e1a18",
        },
        "& p": {
            fontSize: "14px",
            color: "#787878",
            fontWeight: '400'
        },
        "& h6": {
            color: "#7F9801",
            fontSize: '14px',
            maxWidth: '260px',
            fontWeight: '400'
        }
    },
    restaurant_card_box: {
        display: 'flex',
        gap: '7px',
        marginBottom: '6px'
    },
    marginBottom_10px: {
        marginBottom: '10px'
    },
    neighbourhood_section: {
        width: "100%",
    },
    neighbourhood_title: {
        marginBottom: "30px",
        textAlign: "start",
        "& h2": {
            fontSize: "30px",
            fontWeight: "600",
            //color: '#000',
            marginBottom: "10px",
            color: "#1e1a18",
        },
        "& p": {
            color: "#5b606e",
            fontSize: '18px',
            fontWeight: '400'
        },
    },
    flexRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    restaurant_card_footer: {
        display: "flex",
        padding: '10px',
        justifyContent: "space-between",
    },
    delivery_time: {
        display: "flex",
        gap: "5px",
        color: "#5b606e",
        "& p": {
            fontSize: "14px",
            fontWeight: '400',
            color: ' #787878'
        },
        "& svg": {
            fontSize: "20px",
        },
    },
    profile_image: {
        width: '80px',
        height: '80px',
        border: '1px solid #000',
        borderRadius: '50%',
        position: 'absolute',
        top: '40%',
        left: '15px',
        "& img": {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        }
    },
    delivery: {
        position: 'relative',
        padding: '117px 0',
        [theme.breakpoints.down("md")]: {
            padding: '80px 0',
        },
        [theme.breakpoints.down("sm")]: {
            padding: '50px 0',
        },
    },
    deliveryImage: {
        "& img": {
            [theme.breakpoints.down("md")]: {
                width: '100%',
            },
        }
    },
    deliveryDetails: {
        padding: '63px 30px',
        background: theme.palette.background.default,
        border: '1px solid #AFAFAF',
        borderRadius: '16px',
        maxWidth: '662px',
        width: '100%',
        position: 'absolute',
        bottom: '0',
        right: '0',
        [theme.breakpoints.down("md")]: {
            position: 'inherit',
            marginTop: '30px',
            maxWidth: '100%',
            padding: '30px 15px',
        },
    },
    deliveryHeading: {
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '30px',
        padding: '0',
        color: theme.palette.common.color,
    },
    deliveryContant: {
        fontSize: '16px',
        fontWeight: '400',
        marginBottom: '15px',
        padding: '0',
        color: theme.palette.grey['600'],
    },
    startSimpleTitle: {
        padding: '75px 0',
        "& h2": {
            fontSize: '30px',
            fontWeight: '600',
            color: '#0D0D0D',
        }
    },
    simpleImage: {
        "& img": {
            width: '100%'
        }
    },
    stepBox: {
        paddingLeft: '40px !important',
        position: 'relative',
        "&:before": {
            content: '""',
            position: 'absolute',
            backgroundImage: `url(${step_line})`,
            width: '1px',
            height: '150px',
            backgroundRepeat: "no-repeat",
            backgroundSize: 'cover',
            top: '90px',
            zIndex: '-1',
            left: '56px',
            [theme.breakpoints.down("xs")]: {
                height: '180px'
            },
        }
    },
    stepperBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '30px',
        marginTop: '40px',
        [theme.breakpoints.down("lg")]: {
           marginTop: '30px',
        },
    },
    stepperImage: {
        "& img": {
            width: '35px',
            height: '35px',
            [theme.breakpoints.down("sm")]: {
                width: '30px',
                height: '30px',
                objectFit: 'cover'
            },
        }
    },
    stepperText: {
        "& h3": {
            fontSize: '20px',
            fontWeight: '600',
            color: theme.palette.common.bgColor,
            [theme.breakpoints.down("sm")]: {
                fontSize: "16px",
            },
        },
        "& p": {
            fontSize: '14px',
            fontWeight: '400',
            color: theme.palette.grey["600"],
            [theme.breakpoints.down("sm")]: {
                fontSize: "13px",
            },
        }
    },
    hedgeLogo: {
        "& img": {
            width: '48px',
            height: '48px',
            position: 'relative',
            left: '-6px',
            [theme.breakpoints.down("sm")]: {
                width: '30px',
                height: '30px',
                objectFit: 'cover',
                left: '2px'
            },
        }
    },
    stepperBtn: {
        textAlign: 'end',
        "& .MuiButton-root": {
            backgroundColor: theme.palette.common.bgColor,
            fontSize: '14px',
            fontWeight: '400',
            color: theme.palette.primary.light,
            marginTop: '20px',
            textTransform: 'capitalize',
            '&:hover': {
                backgroundColor: theme.palette.common.bgLight,
            }
        }
    },
    accordionTitle:{
        fontSize:'30px',
        fontWeight:'500',
        color: theme.palette.common.bgColor,
        marginBottom:'20px',
        [theme.breakpoints.down("sm")]: {
            fontSize: "24px",
          },
    },
    partnersSection:{
        padding:'117px 0',
    },
    partnersImage:{
    display:'flex',
    alignItems:'center',
    justifyContent:'space-between',
    flexWrap: 'wrap',
    },
    commissionDetails:{
        background: 'linear-gradient(42.09deg, #B9DE31 22.23%, #C8EA19 77.77%)',
        padding:'100px 15px 71px 15px',
        borderRadius:'14px',
        TextAlign:'center',
        [theme.breakpoints.down("md")]: {
            padding:'70px 15px 51px 15px',
          },
          [theme.breakpoints.down("sm")]: {
            padding:'30px 15px 30px 15px',
          },
    },
    commissionHeading:{
        fontSize:'24px',
        fontWeight:'600',
        color:theme.palette.common.color,
        marginBottom:'8px',
        textAlign:'center',
        [theme.breakpoints.down("sm")]: {
            fontSize: "20px",
          },
    },
    commissionContant:{
        fontSize:'20px',
        fontWeight:'300',
        color:theme.palette.common.color,
        marginBottom:'0px',
        textAlign:'center',
        [theme.breakpoints.down("sm")]: {
            fontSize: "16px",
          },
    },
    deliveryJourneySection:{
        padding:'100px 0',
        [theme.breakpoints.down("md")]: {
            padding:'70px 0'
          },
          [theme.breakpoints.down("sm")]: {
            padding:'50px 0'
          },
    },
    partnersHeading:{
        fontSize:'32px',
        fontWeight:'600',
        color:theme.palette.common.color,
        marginBottom:'3px',
        textAlign:'center',
        [theme.breakpoints.down("sm")]: {
            fontSize: "24px",
          },
    },
    partnersContant:{
        fontSize:'18px',
        fontWeight:'400',
        color: theme.palette.grey["600"],
        marginBottom:'40px',
        textAlign:'center',
        [theme.breakpoints.down("sm")]: {
            fontSize: "14px",
          },
    },
    planButton:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        gap:'20px',
        [theme.breakpoints.down("sm")]: {
            display:'block',
          },
    },
    ChoosePlan:{
        padding:'18px 30px',
        fontSize:'16px',
        fontWeight:'600',
        color:theme.palette.text.primary,
        background:theme.palette.common.bgColor,
        '&:hover': {
            backgroundColor: theme.palette.common.bgLight,
        },
        [theme.breakpoints.down("sm")]: {
            width: '100%',
            padding: '10px',
            marginBottom:'10px',
          },
    },
    growBusinessSection:{
        marginTop:'100px',
    },
    sellingImage:{
        maxWidth: '425px',
        width: '100%',
    },
    hLogo:{
        width: '35px !important',
        height: '35px !important',
        left: '0 !important',
    }
}))

export default useStyle;