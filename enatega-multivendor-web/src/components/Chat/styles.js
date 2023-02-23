import makeStyles from "@mui/styles/makeStyles";
import { deepOrange } from "@mui/material/colors";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: "500px",
    maxHeight: "700px",
    width: "400px",
    height: "460px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    [theme.breakpoints.down("sm")]: {
      width: "350px",
    },
  },
  container: {
    position: "fixed",
    right: "35px",
    bottom: "35px",
    [theme.breakpoints.down("sm")]: {
      right: "25px",
      bottom: "35px",
    },
  },
  messagesBody: {
    marginBottom: "10px",
    overflowY: "scroll",
    overflowX: "hidden",
    width: "100%",
    height: "100%",
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    height: 100,
  },
  heading: {
    color: theme.palette.grey[500],
  },
  closeBtn: {
    position: "absolute",
    right: "-20px",
    top: "-20px",
    backgroundColor: "black",
    "&:hover": {
      backgroundColor: "black",
    },
  },
  wrapForm: {
    display: "flex",
    justifyContent: "center",
    width: "95%",
    margin: `${theme.spacing(1)} auto`,
  },
  wrapText: {
    width: "100%",
  },
  input: {
    color: theme.palette.common.black,
  },
  messageRow: {
    display: "flex",
    marginTop: theme.spacing(2),
  },
  messageRowRight: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
  },
  messageGreen: {
    position: "relative",
    marginLeft: "20px",
    padding: 15,
    backgroundColor: theme.palette.primary.main,
    textAlign: "left",
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
  },
  messageOrange: {
    position: "relative",
    marginRight: "20px",
    padding: 15,
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.common.black,
    fontWeight: 600,
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    border: `1px solid theme.palette.common.black`,
    borderRadius: 20,
    borderBottomRightRadius: 0,
  },

  messageContent: {
    padding: 0,
    margin: 0,
    wordWrap: "break-word",
    width: "200px",
  },
  messageTimeStampRight: {
    fontSize: ".85em",
    fontWeight: "300",
    display: "flex",
    justifyContent: "space-between",
  },

  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  avatarNothing: {
    color: "transparent",
    backgroundColor: "transparent",
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  displayName: {
    marginLeft: "20px",
    color: theme.palette.common.black,
  },
}));

export default useStyles;
