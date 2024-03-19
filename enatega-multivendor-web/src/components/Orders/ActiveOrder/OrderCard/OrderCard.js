import {
  Grid,
  Box,
  Typography,
  useTheme,
  Paper,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import useStyles from "./styles";
import ProgressBar from "../LinearProgress/ProgressBar";
import { useTranslation } from 'react-i18next';
const { t  } = useTranslation();
const orderStatuses = [
  {
    key: t('pending'),
    status: 1,
    statusText: "Your order is still pending.",
  },
  {
    key: t('accepted'),
    status: 2,
    statusText: "Restaurant is preparing Food.",
  },
  {
    key: t('assigned'),
    status: 3,
    statusText: "Your order is assigned to rider.",
  },
  {
    key: t('picked'),
    status: 4,
    statusText: "Rider is on the way.",
  },
  {
    key: t('delivered'),
    status: 5,
    statusText: "Order is delivered.",
  },
  {
    key: t('completed'),
    status: 6,
    statusText: "Order is completed.",
  },
];

const checkStatus = (status) => {
  const obj = orderStatuses.filter((x) => {
    return x.key === status;
  });
  return obj[0];
};
export const OrderCard = (props) => {
  const theme = useTheme();
  const extraSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles(extraSmall);
  const { item } = props;

  return (
    <>
      <Grid item lg={5} md={5} key={item.index} className={classes.mt}>
        <RouterLink
          to={{ pathname: `/order-detail/${item._id}` }}
          className={classes.link}
        >
          <Paper elevation={0} className={classes.box}>
            <Box spacing={2} display={"flex"}>
              <Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.textBold}
                >
                  {item.orderId}
                </Typography>
                <ProgressBar />
                <Typography variant="body2" color="textSecondary">
                  {checkStatus(item.orderStatus)?.statusText}
                </Typography>
              </Box>
              <Box
                display={"flex"}
                flex={1}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
              >
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.textBold}
                >
                  {checkStatus(item.orderStatus)?.key}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </RouterLink>
      </Grid>
      <Grid item sm={1} xs={1} />
    </>
  );
};
