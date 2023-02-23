import React from "react";
/* eslint-disable react-hooks/exhaustive-deps */
import { Typography } from "@mui/material";
import useStyles from "./styles";
import { useTheme } from "@emotion/react";

export const MessageLeft = (props) => {
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  const displayName = props.displayName ? props.displayName : "Usama";
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      <div className={classes.messageRow}>
        <div>
          <div className={classes.messageGreen}>
            <div className={classes.messageTimeStampRight}>
              <Typography
                variant="caption"
                style={{ color: theme.palette.grey[600] }}
              >
                {displayName}
              </Typography>
              <Typography
                variant="caption"
                style={{ color: theme.palette.grey[600] }}
              >
                {timestamp}
              </Typography>
            </div>
            <div>
              <p className={classes.messageContent}>{message}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export const MessageRight = (props) => {
  const theme = useTheme();

  const classes = useStyles();
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  return (
    <div className={classes.messageRowRight}>
      <div className={classes.messageOrange}>
        <div className={classes.messageTimeStampRight}>
          <Typography
            variant="caption"
            style={{ color: theme.palette.grey[600] }}
          >
            {"You"}
          </Typography>
          <Typography
            variant="caption"
            style={{ color: theme.palette.grey[600] }}
          >
            {timestamp}
          </Typography>
        </div>
        <p className={classes.messageContent}>{message}</p>
      </div>
    </div>
  );
};
