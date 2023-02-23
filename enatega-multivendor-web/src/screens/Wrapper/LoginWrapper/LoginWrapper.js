import { Box, Container } from "@mui/material";
import React from "react";
import { LoginHeader } from "../../../components/Header";
import useStyles from "./styles";

function LoginWrapper({ children }) {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <LoginHeader />
      <Box className={classes.mainContainer}>
        <Container maxWidth="xs" className={classes.loginBox}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
export default React.memo(LoginWrapper);
