import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import PencilIcon from "../../assets/icons/PencilIcon";
import UserContext from "../../context/User";
import useStyle from "./styles";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function PersonalCard() {
  const theme = useTheme();
  const classes = useStyle();
  const { profile } = useContext(UserContext);
  return (
    <Paper
      style={{
        background: theme.palette.common.white,
        borderRadius: "inherit",
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2),
        marginTop: theme.spacing(4),
      }}
    >
      <Container>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex">
            <Box
              style={{
                background: theme.palette.primary.main,
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography style={theme.typography.body1}><ArrowForwardIcon style={{ paddingTop: 5}} /></Typography>
            </Box>
            <Box ml={theme.spacing(1)} />
            <Typography variant="h5" color="textSecondary">
              Personal Details
            </Typography>
          </Box>
          <Link to="/profile" className={classes.link}>
            <Button
              style={{
                display: "flex",
                alignItems: "center",
                maxWidth: "auto",
                padding: 0,
              }}
            >
              <PencilIcon />
              <Box ml={theme.spacing(1)} />
              <Typography
                style={{
                  ...theme.typography.body1,
                  color: theme.palette.primary.main,
                  fontSize: "0.875rem",
                }}
              >
                Edit
              </Typography>
            </Button>
          </Link>
        </Box>
        <Box mt={theme.spacing(4)}>
          <Typography
            style={{
              ...theme.typography.body1,
              color: theme.palette.text.secondary,
              fontWeight: 700,
              fontSize: "0.875rem",
            }}
          >
            {profile?.name ?? ".."}
          </Typography>
          <Typography
            style={{
              ...theme.typography.caption,
              color: theme.palette.text.secondary,
            }}
          >
            {profile?.email ?? ""}
          </Typography>
          <Typography
            style={{
              ...theme.typography.caption,
              color: theme.palette.text.secondary,
            }}
          >
            {profile?.phone ?? ""}
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
}

export default React.memo(PersonalCard);
