import {
  Box,
  Container,
  Dialog,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import StarSharpIcon from "@mui/icons-material/StarSharp";
import React, { useCallback, useState } from "react";
import useStyles from "./styles";
import TabContainer from "./TabContainer";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function RestaurantInfo({ isVisible, toggleModal, restaurantInfo }) {
  const theme = useTheme();
  const classes = useStyles();
  const extraSmall = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);

  const handleChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  return (
    <Dialog fullScreen={extraSmall} onClose={toggleModal} open={isVisible} scroll="body" fullWidth={true} maxWidth="md">
      <Box display="flex" justifyContent="flex-end">
        <IconButton size={extraSmall ? "medium" : "small"} onClick={toggleModal} className={classes.closeContainer}>
          <CloseIcon color="primary" />
        </IconButton>
      </Box>
      <Box className={classes.imgContainer} style={{ backgroundImage: `url('${restaurantInfo?.image ?? ""}')` }} />
      <Container
        style={{
          background: theme.palette.common.white,
          maxWidth: extraSmall ? "400px" : "700px",
          marginTop: "-50px",
          paddingLeft: "0px",
          paddingRight: "0px",
          boxShadow: theme.shadows[1],
        }}
      >
        <Box pt={theme.spacing(2)}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography className={classes.titleText} style={{ color: theme.palette.text.secondary, fontWeight: 700 }}>
              {restaurantInfo.name}
            </Typography>
            <Box pl={theme.spacing(1)} pr={theme.spacing(1)} />
            <StarSharpIcon style={{ fontSize: "14px", color: "#276fa5" }} />
            <Typography className={classes.xSmallText} style={{ fontWeight: 700, color: theme.palette.text.secondary }}>
              {restaurantInfo.reviewData.ratings}
            </Typography>
            <Typography className={classes.xSmallText}>/5</Typography>
            <Typography style={{ fontSize: "0.875rem", marginLeft: "3px" }} className={classes.xSmallText}>
              {` (${restaurantInfo.reviewData.total})`}
            </Typography>
            <Box pb={theme.spacing(2)} />
          </Box>
          <Box
            display="flex"
            paddingLeft={`${theme.spacing(1)}`}
            alignItems="center"
            justifyContent="center"
            pt={theme.spacing(2)}
          >
            {restaurantInfo.deals.map((item, index) => (
              <Box display="flex" alignItems="center" key={`MODAL_DELAS_${index}`}>
                <FiberManualRecordIcon
                  style={{
                    fontSize: "5px",
                    paddingRight: "5px",
                    color: theme.palette.text.disabled,
                  }}
                />
                <Typography className={classes.xSmallText} style={{ paddingRight: "5px" }}>
                  {item.title}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box display="flex" justifyContent="center" pt={theme.spacing(2)} pb={theme.spacing(2)}>
            <Typography className={classes.smallText}>{`Delivery ${restaurantInfo.deliveryTime} Minute`} </Typography>
          </Box>
          <Divider light orientation="horizontal" />
          <Box display="flex" justifyContent="center">
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab style={{ color: "black" }} label="ABOUT" {...a11yProps(0)} />
              <Tab style={{ color: "black" }} label="REVIEWS" {...a11yProps(1)} />
            </Tabs>
          </Box>
        </Box>
      </Container>
      <Container
        style={{
          maxWidth: extraSmall ? "400px" : "700px",
          paddingLeft: "0px",
          paddingRight: "0px",
        }}
      >
        <TabContainer style={{ paddingLeft: "0px", paddingRight: "0px" }} value={tabValue} index={0}>
          <Typography className={classes.titleText} style={{ color: theme.palette.text.secondary }}>
            Delivery hours
          </Typography>
          {restaurantInfo.openingTimes.map((dayOb, index) => (
            <Box display="flex" key={`${dayOb}_${index}`}>
              <Typography className={classes.smallText} style={{ width: "40px" }}>
                {" "}
                {`${dayOb.day}`}
              </Typography>
              {dayOb.times.length < 1 ? (
                <Typography key={"closed"} className={classes.smallText}>
                  {" "}
                  Closed all day
                </Typography>
              ) : (
                dayOb.times.map((timeObj, index) => (
                  <Typography key={`TIME_${index}`} className={classes.smallText}>
                    {" "}
                    {timeObj.startTime[0]}:{timeObj.startTime[1]}
                    {" - "}
                    {timeObj.endTime[0]}:{timeObj.endTime[1]}
                  </Typography>
                ))
              )}
            </Box>
          ))}
          <Box pt={theme.spacing(2)} />
          <Typography className={classes.titleText} style={{ color: theme.palette.text.secondary }}>
            Address
          </Typography>
          <Typography className={classes.smallText}>{restaurantInfo.address || ""}</Typography>
        </TabContainer>
        <TabContainer value={tabValue} index={1}>
          <Typography className={classes.titleText} style={{ color: theme.palette.text.secondary }}>
            {`${restaurantInfo.reviewData.total} Reviews`}
          </Typography>
          <Box className={classes.line}>
            <Divider />
          </Box>
          {restaurantInfo.reviewData.reviews.map((review, index) => (
            <Box key={`REVIEW_${review._id}`}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" color="textSecondary" className={classes.lightText}>
                  {review.order.user.name}
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <StarSharpIcon style={{ fontSize: "14px", color: "#276fa5" }} />
                  <Typography
                    className={classes.xSmallText}
                    style={{ fontWeight: 700, color: theme.palette.text.secondary }}
                  >
                    {review.rating}
                  </Typography>
                  <Typography className={classes.xSmallText}>/5</Typography>
                </Box>
              </Box>
              <Typography
                variant="subtitle1"
                className={classes.lightText}
                style={{ color: theme.palette.text.disabled }}
              >
                {new Date(review.createdAt).toDateString()}
              </Typography>
              <Typography
                variant="subtitle1"
                className={`${classes.line} ${classes.lightText}`}
                style={{ color: theme.palette.text.disabled }}
              >
                {review.description}
              </Typography>
              <Divider />
            </Box>
          ))}
        </TabContainer>
      </Container>
    </Dialog>
  );
}

export default React.memo(RestaurantInfo);
