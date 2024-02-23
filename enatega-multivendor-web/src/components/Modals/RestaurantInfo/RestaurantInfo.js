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
import { useTranslation } from "react-i18next";
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
  const extraSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState(0);
  const { t } = useTranslation();

  const handleChange = useCallback((event, newValue) => {
    setTabValue(newValue);
  }, []);

  return (
    <Dialog
      fullScreen={extraSmall}
      onClose={toggleModal}
      open={isVisible}
      scroll="body"
      fullWidth={true}
      maxWidth="md"
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          size={extraSmall ? "medium" : "small"}
          onClick={toggleModal}
          className={classes.closeContainer}
        >
          <CloseIcon color="primary" />
        </IconButton>
      </Box>
      <Box
        className={classes.imgContainer}
        style={{ backgroundImage: `url('${restaurantInfo?.image ?? ""}')` }}
      />
      <Container
        maxWidth={extraSmall ? "400px" : "700px"}
        className={classes.restaurantContainer}
      >
        <Box pt={theme.spacing(2)}>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography
              className={classes.titleText}
              color={theme.palette.text.secondary}
              fontWeight={theme.typography.fontWeightBold}
            >
              {restaurantInfo.name}
            </Typography>
            <Box pl={theme.spacing(1)} pr={theme.spacing(1)} />
            <StarSharpIcon className={classes.starIcon} />
            <Typography
              className={classes.xSmallText}
              color={theme.palette.text.secondary}
              fontWeight={theme.typography.fontWeightBold}
            >
              {restaurantInfo.reviewData.ratings}
            </Typography>
            <Typography className={classes.xSmallText}>/5</Typography>
            <Typography marginLeft={3} className={classes.SmallText}>
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
              <Box
                display="flex"
                alignItems="center"
                key={`MODAL_DELAS_${index}`}
              >
                <FiberManualRecordIcon
                  color={theme.palette.text.disabled}
                  fontSize="5px"
                  paddingRight="5px"
                />
                <Typography className={classes.xSmallText}>
                  {item.title}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            pt={theme.spacing(2)}
            pb={theme.spacing(2)}
          >
            <Typography className={classes.smallText}>
              {`${t("delivery")} ${restaurantInfo.deliveryTime} ${t("minute")}`}{" "}
            </Typography>
          </Box>
          <Divider light orientation="horizontal" />
          <Box display="flex" justifyContent="center">
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab
                color={theme.palette.common.black}
                label={t("about")}
                {...a11yProps(0)}
              />
              <Tab
                color={theme.palette.common.black}
                label={t("reviews")}
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
        </Box>
      </Container>
      <Container maxWidth={extraSmall ? "400px" : "700px"}>
        <TabContainer value={tabValue} index={0}>
          <Typography
            className={classes.titleText}
            color={theme.palette.text.secondary}
          >
            {t("deliveryHours")}
          </Typography>
          <Box pt={theme.spacing(2)} />
          {restaurantInfo.openingTimes.map((dayOb, index) => (
            <Box
              display="flex"
              key={`${dayOb}_${index}`}
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                display="flex"
                backgroundColor={theme.palette.primary.main}
                borderRadius="24px"
                padding="10px"
                marginBottom="10px"
                justifyContent="center"
                alignItems="center"
                width="80%"
              >
                <Typography className={classes.smallText} width="40px">
                  {" "}
                  {`${dayOb.day}`}
                </Typography>
                {dayOb.times.length < 1 ? (
                  <Typography key={"closed"} className={classes.smallText}>
                    {" "}
                    {t("closedAllDay")}
                  </Typography>
                ) : (
                  dayOb.times.map((timeObj, index) => (
                    <Typography
                      key={`TIME_${index}`}
                      className={classes.smallText}
                    >
                      {" "}
                      {timeObj.startTime[0]}:{timeObj.startTime[1]}
                      {" - "}
                      {timeObj.endTime[0]}:{timeObj.endTime[1]}
                    </Typography>
                  ))
                )}
              </Box>
            </Box>
          ))}
          <Box pt={theme.spacing(2)} />

          <Typography
            className={classes.titleText}
            color={theme.palette.text.secondary}
          >
            {t("address")}
          </Typography>
          <Box pt={theme.spacing(2)} />
          <Box
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              display="flex"
              backgroundColor={theme.palette.primary.main}
              borderRadius="24px"
              padding="10px"
              marginBottom="10px"
              justifyContent="center"
              alignItems="center"
              width="80%"
            >
              <Typography className={classes.smallText}>
                {restaurantInfo.address || ""}
              </Typography>
            </Box>
          </Box>
        </TabContainer>
        <TabContainer value={tabValue} index={1}>
          <Typography
            className={classes.titleText}
            color={theme.palette.common.white}
          >
            {`${restaurantInfo.reviewData.total} ${t("reviews")}`}
          </Typography>
          <Box className={classes.line}>
            <Divider />
          </Box>
          {restaurantInfo.reviewData.reviews.map((review, index) => (
            <Box key={`REVIEW_${review._id}`}>
              <Box className={classes.reviewContainer}>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    variant="h6"
                    color={theme.palette.common.white}
                    className={classes.lightText}
                  >
                    {review.order.user.name}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <StarSharpIcon className={classes.starSharp} />
                    <Typography
                      color={theme.palette.common.white}
                      fontWeight={theme.typography.fontWeightMedium}
                    >
                      {review.rating}
                    </Typography>
                    <Typography color={theme.palette.common.white}>
                      /5
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="subtitle1"
                  className={`${classes.line} ${classes.lightText}`}
                  color={theme.palette.common.white}
                >
                  {review.description}
                </Typography>
                <Divider />
              </Box>
            </Box>
          ))}
        </TabContainer>
      </Container>
    </Dialog>
  );
}

export default React.memo(RestaurantInfo);
