/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Typography, useTheme, Avatar, Divider } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import React from "react";
import useStyles from "./styles";
import Scooter from "../../../assets/images/scooter.png";
import Arrow from "../../../assets/images/arrow.png";
import Preparing from "../../../assets/images/preparing.png";
import Delivered from "../../../assets/images/delivered.png";

export default function StatusCard(props) {
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
    "PENDING",
    "ACCEPTED",
    "ASSIGNED",
    "PICKED",
    "DELIVERED",
    "CANCELLED",
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
    console.log("prep", preparationTime, "calc", calculateTime);
    let description = "";
    let estimated_time = "";
    let feedback = "";
    let status_image = "";
    switch (orderStatus) {
      case "PENDING":
        description = "Waiting response from";
        estimated_time = restaurant?.name ?? "...";
        feedback = "";
        status_image = Arrow;
        break;
      case "ACCEPTED":
        description = `Estimated preparation time`;
        estimated_time =
          calculateTime > 0
            ? `${calculateTime} Min`
            : "Sorry! Your order is bit late.";
        feedback = `Preparing your food.${
          isPickedUp ? "" : " Your rider will pick it up once its ready"
        }`;
        status_image = Preparing;
        break;
      case "ASSIGNED":
        description = `Your order is `;
        estimated_time = "assigned to the rider";
        feedback = `Your order is assigned to our rider, order will be picked once its ready.`;
        status_image = Scooter;
        break;
      case "PICKED":
        description = " Your order is ";
        estimated_time = "Picked";
        feedback = "Your rider is on the way.";
        status_image = Scooter;
        break;
      case "DELIVERED":
        description = "Your order has been";
        estimated_time = "Delivered";
        feedback = "Enjoy your meal!";
        status_image = Delivered;
        break;
      case "CANCELLED":
        description = "Your order has been";
        estimated_time = "Cancelled";
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

  const { description, estimated_time, feedback, status_image } =
    getOrderStatusValues(props);
  console.log(feedback);
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
          status={"Order placed"}
          time={formatTime(createdAt)}
          first={true}
          number={1}
          last={false}
        />

        <StatusRow
          isEta={STATUS_ORDER.indexOf(orderStatus) < 1}
          status={"Accepted"}
          time={acceptedAt ? formatTime(acceptedAt) : "--:--"}
          first={false}
          last={false}
          number={2}
        />
        <StatusRow
          isEta={STATUS_ORDER.indexOf(orderStatus) < 2}
          status={"Assigned"}
          time={assignedAt ? formatTime(assignedAt) : "--:--"}
          first={false}
          number={3}
          last={false}
        />
        <StatusRow
          isEta={STATUS_ORDER.indexOf(orderStatus) < 3}
          status={"Picked"}
          time={pickedAt ? formatTime(pickedAt) : "--:--"}
          first={false}
          number={4}
          last={false}
        />
        <StatusRow
          isEta={STATUS_ORDER.indexOf(orderStatus) < 4}
          status={"Delivered"}
          time={deliveredAt ? formatTime(deliveredAt) : "--:--"}
          first={false}
          number={5}
          last={true}
        />
      </Box>
    </>
  );
}

function StatusRow({ first, isEta, status, time, number, last }) {
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
