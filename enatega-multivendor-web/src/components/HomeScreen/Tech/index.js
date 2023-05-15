import {
  Grid,
  useMediaQuery,
  useTheme,
  Box,
  Container,
  Typography,
} from "@mui/material";
import React from "../../../assets/images/react.png";
import Node from "../../../assets/images/node.png";
import Mongo from "../../../assets/images/mongodb.png";
import Firebase from "../../../assets/images/firebase.png";
import Graphql from "../../../assets/images/gql.png";
import MUI from "../../../assets/images/mui.png";
import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  bgText: {
    position: "absolute",
    bottom: -90,
    left: 0,
    fontSize: 80,
    fontWeight: 500,
    color: "#000000",
    mixBlendMode: "normal",
    opacity: 0.24,
  },
  bgTextSmall: {
    position: "absolute",
    top: -90,
    left: 20,
    fontSize: 50,
    fontWeight: 500,
    color: "#000000",
    mixBlendMode: "normal",
    opacity: 0.24,
  },
}));

export default function Tech() {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyle();
  return (
    <Container
      style={{
        marginTop: "10rem",
        marginBottom: "10rem",
        position: "relative",
      }}
    >
      <Typography className={small ? classes.bgTextSmall : classes.bgText}>
        Tech
      </Typography>
      <Grid container justify="flex-end" spacing={3}>
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="center">
            <img src={React} alt="React" />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="flex-end">
            <img src={Node} alt="Node" />
          </Box>
        </Grid>
        <Box mt={5} />
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-start">
            <img src={Mongo} alt="Mongo" />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={2}></Grid>
            <Grid item xs={10}>
              <Box display="flex" justifyContent="center">
                <img src={MUI} alt="MUI" />
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="center">
            <img src={Firebase} alt="Firebase" />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="flex-end">
            <img src={Graphql} alt="Graphql" />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
