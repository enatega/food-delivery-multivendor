import { Box, Container, Divider, Link, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const useStyles = makeStyles((theme) => ({
  titleStyle: {
    ...theme.typography.subtitle2,
    color: theme.palette.text.disabled,
  },
  copyRightText: {
    ...theme.typography.caption,
    color: theme.palette.text.disabled,
  },
  footerText: {
    ...theme.typography.caption,
    color: theme.palette.text.disabled,
    margin: "0px 10px",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  iconStyles: {
    color: theme.palette.text.disabled,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

function Footer() {
  const classes = useStyles();
  return (
    <Container
      maxWidth="xl"
      style={{
        marginTop: "5vw",
        marginBottom: "5vw",
        marginLeft: "0px",
        paddingLeft: "5vw",
        paddingRight: "5vw",
      }}
    >
      <Divider style={{ width: "100%" }} light orientation="horizontal" />
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px 0px",
        }}
      >
        <Typography className={classes.titleStyle}>Enatega</Typography>
        <Box style={{ display: "flex" }}>
          <Link href="https://www.facebook.com/enatega">
            <FacebookIcon className={classes.iconStyles} fontSize="large" />
          </Link>
          <Link href="https://www.instagram.com/enatega.nb/">
            <InstagramIcon style={{ marginLeft: "20px" }} className={classes.iconStyles} fontSize="large" />
          </Link>
        </Box>
      </Box>
      <Divider style={{ width: "100%" }} light orientation="horizontal" />
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px 0px",
        }}
      >
        <Typography className={classes.copyRightText}>
          © {new Date().getFullYear()}
          {"    "}Enatega
        </Typography>
      </Box>
      <Divider style={{ width: "100%" }} light orientation="horizontal" />
    </Container>
  );
}

export default Footer;
