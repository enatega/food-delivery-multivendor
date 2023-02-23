import {
  Box,
  Container,
  Paper,
  Typography,
  useTheme,
  Grid,
  TextField,
  Fade,
} from "@mui/material";
import React, { useState } from "react";
import clsx from "clsx";
import useStyle from "./styles";
import { DateTimePicker, LocalizationProvider } from "@mui/lab"
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function OrderOption(props) {
  const theme = useTheme();
  const classes = useStyle();
  const { setIsPickUp, selectedDate, handleDateChange } = props;
  const [deliveryOption, setDeliveryOption] = useState("Delivery");
  const DELIVER_OPTIONS = ["Delivery", "Pick Up"];

  const renderDateBox = (isSelected, item, props) => {
    return (
      <Grid item xs={12} sm={6}>
        <Paper
          onClick={() => {
            setDeliveryOption(item);
            setIsPickUp(item === "Pick Up");
          }}
          className={clsx(classes.width100, classes.deliveryPaper)}
        >
          <Box
            className={clsx(
              classes.PH1,
              classes.PB2,
              classes.deliveryBox,
              {
                [classes.selectedDeliveryBox]: isSelected,
              }
            )}
          >
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              pt={theme.spacing(1)}
            ></Box>
            <Box
              justifyContent="flex-start"
              mt={theme.spacing(1)}
            >
              <TextField
                {...props}
                label={item}
                variant="standard"
              />
            </Box>
          </Box>
        </Paper>
      </Grid>
    )
  }
  return (
    <Paper
      className={classes.root}
      style={{
        background: theme.palette.common.white,
        borderRadius: "inherit",
        paddingBottom: theme.spacing(2),
        paddingTop: theme.spacing(2),
        marginBottom: theme.spacing(4),
      }}
    >
      <Container>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex">
            <Box
              style={{
                background: theme.palette.primary.main,
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography style={theme.typography.body1}><ArrowForwardIcon style={{ paddingTop: 5 }} /></Typography>
            </Box>
            <Box ml={theme.spacing(1)} />
            <Typography variant="h5" color="textSecondary">
              Delivery Options
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pt={theme.spacing(1)}
          pb={theme.spacing(1)}
        />
        <Grid container spacing={2}>
          {DELIVER_OPTIONS.map((item, index) => {
            const isSelected = item === deliveryOption;
            return (
              <LocalizationProvider key={index} dateAdapter={AdapterDateFns}>
                <Fade in>
                  <DateTimePicker
                    ampm
                    disableFuture
                    disablePast
                    value={selectedDate}
                    onChange={(date) => {
                      handleDateChange(date)
                    }}
                    renderInput={(props) => renderDateBox(isSelected, item, props)}
                  />
                </Fade>
              </LocalizationProvider>

            );
          })}
        </Grid>
      </Container>
    </Paper>
  );
}

export default React.memo(OrderOption);
