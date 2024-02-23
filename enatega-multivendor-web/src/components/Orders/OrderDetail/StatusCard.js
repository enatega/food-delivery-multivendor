/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography, useTheme, Avatar, Divider } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import useStyles from "./styles";
import Scooter from "../../../assets/images/scooter.png";
import Arrow from "../../../assets/images/arrow.png";
import Preparing from "../../../assets/images/preparing.png";
import Delivered from "../../../assets/images/delivered.png";
import { useTranslation } from 'react-i18next';

export default function StatusCard(props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const small = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    orderStatus = "CANCELLED",
    createdAt,
    acceptedAt,
    deliveredAt,
    pickedAt,
    assignedAt,
  } = props;

  const STATUS_ORDER = [
    t('pending'),
    t('accepted'),
    t('assigned'),
    t('picked'),
    t('delivered'),
    t('completed'),
  ];

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", { timeStyle: "short" });

  function getOrderStatusValues({
    preparationTime,
    isPickedUp,
    orderStatus,
    restaurant,
  }) {
    const calculateTime = Math.floor(
      (new Date(preparationTime) - Date.now()) / 1000 / 60
    );
   
    let description = "";
    let estimated_time = "";
    let feedback = "";
    let status_image = "";
    switch (orderStatus) {
      case "PENDING":
        description = t('pendingText');
        estimated_time = restaurant?.name ?? "...";
        feedback = "";
        status_image = Arrow;
        break;
      case "ACCEPTED":
        description = `${t('acceptedText')}`;
        estimated_time =
          calculateTime > 0
            ? `${calculateTime} Min`
            : t('orderLateText');
        feedback = `Preparing your food.${
          isPickedUp ? "" : t('riderPickText')
        }`;
        status_image = Preparing;
        break;
      case "ASSIGNED":
        description = `${t('orderIs')}`;
        estimated_time = t('orderAssigned');
        feedback = `${t('orderAssignedToRider')}`;
        status_image = Scooter;
        break;
      case "PICKED":
        description = t('orderIs');
        estimated_time = t('picked');
        feedback = t('riderOnWay');
        status_image = Scooter;
        break;
      case "DELIVERED":
        description = t('orderHasBeen');
        estimated_time = t('delivered');
        feedback = t('enjoyYourMeal');
        status_image = Delivered;
        break;
      case "CANCELLED":
        description = t('orderHasBeen');
        estimated_time = t('cancelled');
        feedback = "";
        status_image = null;
        break;
      default:
        break;
    }
    return {
      description,
      estimated_time,
      feedback,
      status_image,
    };
  }

  const { description, estimated_time,  status_image } =
    getOrderStatusValues(props);

  return (
    <>
      <Box className={classes.topOrder} mb={!small && theme.spacing(2)}>
        <Box className={classes.innerTopOrder}>
          <img
            src={status_image}
            alt="scooty"
            style={{ marginRight: 16, marginLeft: 16 }}
          />
          <Typography
            variant="body2"
            color="common"
            mr={theme.spacing(2)}
            className={`${classes.textBold} ${classes.mediumText}`}
          >
            {description}
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            style={{ backgroundColor: "white" }}
            variant="middle"
          />
          <Typography
            variant="body2"
            color="common"
            className={classes.mediumText}
            ml={theme.spacing(2)}
          >
            {estimated_time}
          </Typography>
        </Box>
      </Box>
      <Divider
        orientation="horizontal"
        flexItem
        style={{ backgroundColor: "white" }}
        variant="middle"
        sx={{ display: { xs: "none", sm: "block" } }}
      />
      <Box className={classes.bottomOrder} mt={!small && theme.spacing(2)}>
        <StatusRow
          isEta={false}
          status={t('orderPlaced')}
          time={formatTime(createdAt)}
          first={true}
          number={1}
          last={false}
        />

        <StatusRow
          isEta={STATUS_ORDER.indexOf(orderStatus) < 1}
          status={t('ACCEPTED')}
          time={acceptedAt ? formatTime(acceptedAt) : "--:--"}
          first={false}
          last={false}
          number={2}
        />
        <StatusRow
          isEta={STATUS_ORDER.indexOf(orderStatus) < 2}
          status={t('ASSIGNED')}
          time={assignedAt ? formatTime(assignedAt) : "--:--"}
          first={false}
          number={3}
          last={false}
        />
        <StatusRow
          isEta={STATUS_ORDER.indexOf(orderStatus) < 3}
          status={t('PICKED')}
          time={pickedAt ? formatTime(pickedAt) : "--:--"}
          first={false}
          number={4}
          last={false}
        />
        <StatusRow
          isEta={STATUS_ORDER.indexOf(orderStatus) < 4}
          status={t('DELIVERED')}
          time={deliveredAt ? formatTime(deliveredAt) : "--:--"}
          first={false}
          number={5}
          last={true}
        />
      </Box>
    </>
  );
}

export function StatusRow({ first, isEta, status, time, number, last }) {
  const theme = useTheme();
  const classes = useStyles();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      className={classes.innerBottomOrder}
      ml={!small && first && theme.spacing(2)}
    >
      <Avatar
        sx={{
          bgcolor: isEta ? theme.palette.grey[500] : theme.palette.primary.main,
          width: 20,
          height: 20,
        }}
      >
        <Typography variant="body2" color="common" className={classes.textBold}>
          {number}
        </Typography>
      </Avatar>
      <Box className={classes.typos}>
        <Typography
          variant="body2"
          color={isEta ? theme.palette.grey[500] : theme.palette.primary.main}
          className={`${classes.textBold} ${classes.smallText} `}
          sx={{ ml: theme.spacing(2), mr: theme.spacing(2) }}
        >
          {status}
        </Typography>
        <Typography
          variant="body2"
          color={isEta ? theme.palette.grey[500] : theme.palette.primary.main}
          className={`${classes.textBold} ${classes.smallText}`}
          sx={{ ml: theme.spacing(2) }}
        >
          {isEta ? "ETA " : ""}
          {time}
        </Typography>
      </Box>
      {!last && (
        <Box
          sx={{
            display: { xs: "none", md: "inline-block" },
            width: 25,
            backgroundColor: isEta
              ? theme.palette.grey[500]
              : theme.palette.primary.main,
            height: "1px",
          }}
        />
      )}
    </Box>
  );
}
