import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import React, { useContext } from "react";
import UserContext from "../../context/User";
import useStyle from "./styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslation } from 'react-i18next';

function PersonalCard({ toggleModal, location }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyle();
  const { profile } = useContext(UserContext);

  return (
    <>
      <Paper
        style={{
          background: theme.palette.common.white,
          paddingBottom: theme.spacing(2),
          paddingTop: theme.spacing(2),
          borderRadius: 20,
          boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.2)",
        }}
      >
        <Container>
          <Box>
            <Box display="flex" alignItems="center">
              <LocationOnIcon
                style={{ paddingTop: 5, color: theme.palette.primary.main }}
              />
              <Box ml={theme.spacing(1)} />
              <Typography
                variant="body2"
                color="textSecondary"
                fontWeight={800}
              >
                {t('contactInfo')}
              </Typography>
            </Box>
            <Divider
              orientation="horizontal"
              style={{
                backgroundColor: "rgb(72 71 71 / 66%)",
                marginTop: theme.spacing(1),
              }}
            />
          </Box>

          <Box mt={theme.spacing(4)}>
            <Box display="flex" justifyContent="space-between">
              <Typography
                style={{
                  ...theme.typography.body1,
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                }}
              >
                {t('name')} :
              </Typography>
              <Typography
                style={{
                  ...theme.typography.body1,
                  color: theme.palette.common.black,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {profile?.name ?? ".."}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              className={classes.MV2}
            >
              <Typography
                style={{
                  ...theme.typography.body1,
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                }}
              >
                {t('email')} :
              </Typography>
              <Typography
                style={{
                  ...theme.typography.caption,
                  color: theme.palette.common.black,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {profile?.email ?? ""}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography
                style={{
                  ...theme.typography.body1,
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                }}
              >
                {t('phone')} :
              </Typography>
              <Typography
                style={{
                  ...theme.typography.caption,
                  color: theme.palette.common.black,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {profile?.phone ?? ""}
              </Typography>
            </Box>
            <Divider
              orientation="horizontal"
              className={classes.MV2}
              style={{
                backgroundColor: "rgb(72 71 71 / 66%)",
              }}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography
                style={{
                  ...theme.typography.body1,
                  color: theme.palette.text.secondary,
                  fontSize: "0.875rem",
                }}
              >
                {t('address')}: 
              </Typography>
              <Typography
                style={{
                  ...theme.typography.caption,
                  color: theme.palette.common.black,
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  paddingLeft: 10
                }}
              >
                {location?.deliveryAddress.split(",")[0] ?? ""}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                disableElevation
                color="primary"
                className={classes.addressBtn}
                onClick={toggleModal}
              >
                <Typography
                  variant="caption"
                  color="black"
                  fontWeight={800}
                  style={{ textTransform: "capitalize" }}
                >
                  {t('changeAddress')}
                </Typography>
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>
    </>
  );
}

export default React.memo(PersonalCard);
