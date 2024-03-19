import { Box, Container, Typography, useTheme } from "@mui/material";
import StarSharpIcon from "@mui/icons-material/StarSharp";
import clsx from "clsx";
import React, { useCallback } from "react";
import { DAYS } from "../../../utils/constantValues";
import useStyles from "./styles";
import { useTranslation } from "react-i18next";

function RestaurantHeader({ headerData, loading = false }) {
  const theme = useTheme();
  const classes = useStyles();
  const { t } = useTranslation();
  const isOpen = useCallback(() => {
    if (headerData.openingTimes) {
      if (headerData?.openingTimes?.length < 1) return false;
      const date = new Date();
      const day = date.getDay();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const todaysTimings = headerData.openingTimes.find(
        (o) => o.day === DAYS[day]
      );
      if (todaysTimings === undefined) return false;
      const times = todaysTimings.times.filter(
        (t) =>
          hours >= Number(t.startTime[0]) &&
          minutes >= Number(t.startTime[1]) &&
          hours <= Number(t.endTime[0]) &&
          minutes <= Number(t.endTime[1])
      );

      return times.length > 0;
    }
    return true;
  }, [headerData]);

  const isClosed = !isOpen() || !headerData.isAvailable;

  return (
    <Box>
      <Container style={{ marginLeft: "0px" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "15px",
          }}
        >
          <Typography className={classes.restaurantTitle} align="center">
            {headerData?.name ?? "..."}
          </Typography>
        </Box>
      </Container>
      {!loading && (
        <>
          <Container
            style={{
              marginLeft: "0px",
              display: "flex",
              marginTop: 15,
              justifyContent: "center",
            }}
          >
            <Box
              className={clsx({
                [classes.tagContainer]: !isClosed,
                [classes.closeContainer]: isClosed,
              })}
            >
              <Typography
                className={clsx({
                  [classes.tagStyles]: !isClosed,
                  [classes.closeTag]: isClosed,
                })}
              >
                {true ? t("new") : t("closed")}
              </Typography>
            </Box>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "15px",
              }}
            >
              <StarSharpIcon
                style={{
                  fontSize: "16px",
                  color: theme.palette.common.white,
                  marginRight: 5,
                }}
              />
              <Typography className={classes.currentRatingText} align="center">
                {headerData.averageReview}
              </Typography>
              <Typography className={classes.totalRatingText}>/5</Typography>
              <Typography
                style={{ fontSize: "0.875rem", marginLeft: "3px" }}
                className={classes.totalRatingText}
              >
                {headerData.averageTotal}
              </Typography>
            </Box>
          </Container>
          <Container style={{ marginLeft: "0px" }}>
            <Box
              style={{
                display: "flex",
                padding: "15px 0px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                className={classes.categoriesStyle}
                style={{ paddingRight: "5px" }}
                align="center"
              >
                {t("deliver")} {headerData?.deliveryTime} {t("minute")}
              </Typography>
            </Box>
          </Container>
        </>
      )}
    </Box>
  );
}

export default React.memo(RestaurantHeader);
