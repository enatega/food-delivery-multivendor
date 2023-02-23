import { Box, IconButton, Typography, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useContext } from "react";
import ConfigurationContext from "../../../context/Configuration";
import useStyles from "./styles";

function CartItem(props) {
  const classes = useStyles();
  const theme = useTheme();
  const configuration = useContext(ConfigurationContext);

  return (
    <Box style={{ marginTop: theme.spacing(4) }}>
      <Box style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography className={classes.itemTextStyle}>
          {props.foodTitle ? props.foodTitle : ""}
        </Typography>
        <Typography
          style={{ color: theme.palette.text.disabled }}
          className={classes.subtotalText}
        >
          {` ${configuration.currencySymbol}  ${parseFloat(
            props.dealPrice
          ).toFixed(2)}`}
        </Typography>
      </Box>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Typography
            style={{
              color: theme.palette.text.secondary,
              fontSize: "0.7rem",
              marginTop: theme.spacing(0.5)
            }}
            className={classes.itemTextStyle}
          >
            {props.variationTitle ? `(${props.variationTitle})` : ""}
          </Typography>
          {props?.optionTitles?.map((title,index) => (
            <Box
              key={index}
              style={{
                display: "flex",
              }}
            >
              <Typography
                style={{
                  color: theme.palette.text.disabled,
                  fontSize: "0.7rem",
                }}
                className={classes.optionTextStyle}
              >
                +{title}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box display="flex" alignItems="flex-start" width="75px">
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              width: "75px",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                props.removeQuantity();
              }}
            >
              <RemoveIcon fontSize="small" color="primary" />
            </IconButton>
            <Typography
              style={{
                ...theme.typography.caption,
                fontWeight: 700,
                color: theme.palette.text.secondary,
              }}
            >
              {props.quantity ? props.quantity : 0}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault();
                props.addQuantity();
              }}
            >
              <AddIcon fontSize="small" color="primary" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default React.memo(CartItem);
