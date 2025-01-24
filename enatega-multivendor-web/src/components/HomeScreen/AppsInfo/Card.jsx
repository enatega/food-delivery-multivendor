import { Box, Typography } from "@mui/material";
import { React } from "react";
import Tick from "../TickComponent/Tick";
import useStyle from "./styles";
import { Link as RouterLink } from "react-router-dom";

const Card = ({ heading, ticksList, buttons }) => {
  let classes = useStyle();
  return (
    <Box>
      <Typography className={classes.heading}>{heading}</Typography>
      {ticksList.map((item) => {
        return <Tick heading={item.heading} text={item.text} />;
      })}

      <Box className={classes.buttonContainer}>
        {buttons.map((button) => {
          return (
            <RouterLink
              to={button.link}
              className={classes.button}
              style={{
                backgroundColor: button.color,
                color: button.textColor,
                border: button.isOutline
                  ? `1px solid ${button.textColor}`
                  : " ",
              }}
            >
              <Typography>{button.text}</Typography>
            </RouterLink>
          );
        })}
      </Box>
    </Box>
  );
};

export default Card;
