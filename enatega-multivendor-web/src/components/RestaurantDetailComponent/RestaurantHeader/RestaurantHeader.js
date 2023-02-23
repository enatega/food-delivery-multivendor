import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StarSharpIcon from "@mui/icons-material/StarSharp";
import clsx from "clsx";
import React, { useCallback } from "react";
import { DAYS } from "../../../utils/constantValues";
import useStyles from "./styles";

function RestaurantHeader({ toggleModal, headerData, loading = false }) {
  const theme = useTheme();
  const classes = useStyles();

  const isOpen = useCallback(() => {
    if (headerData.openingTimes) {
      if (headerData?.openingTimes?.length < 1) return false;
      const date = new Date();
      const day = date.getDay();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const todaysTimings = headerData.openingTimes.find((o) => o.day === DAYS[day]);
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
            justifyContent: "space-between",
            paddingTop: "15px",
          }}
        >
          <Typography className={classes.restaurantTitle}>{headerData?.name ?? "..."}</Typography>
          <Button onClick={toggleModal}>
            <InfoOutlinedIcon color="primary" />
          </Button>
        </Box>
      </Container>
      {!loading && (
        <>
          <Container style={{ marginLeft: "0px", display: "flex" }}>
            <Box className={clsx({ [classes.tagContainer]: !isClosed, [classes.closeContainer]: isClosed })}>
              <Typography className={clsx({ [classes.tagStyles]: !isClosed, [classes.closeTag]: isClosed })}>
                {true ? "NEW" : "Closed"}
              </Typography>
            </Box>
            <Box style={{ display: "flex", alignItems: "center", marginLeft: "15px" }}>
              <StarSharpIcon style={{ fontSize: "14px", color: "#276fa5" }} />
              <Typography className={classes.currentRatingText}>{headerData.averageReview}</Typography>
              <Typography className={classes.totalRatingText}>/5</Typography>
              <Typography style={{ fontSize: "0.875rem", marginLeft: "3px" }} className={classes.totalRatingText}>
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
              }}
            >
              {headerData?.deals.map((item, index) => (
                <Box style={{ display: "flex", alignItems: "center" }} key={index}>
                  <FiberManualRecordIcon
                    style={{
                      fontSize: "5px",
                      paddingRight: "5px",
                      color: theme.palette.text.disabled,
                    }}
                  />
                  <Typography className={classes.categoriesStyle} style={{ paddingRight: "5px" }}>
                    {item.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </>
      )}
    </Box>
  );
}

export default React.memo(RestaurantHeader);
