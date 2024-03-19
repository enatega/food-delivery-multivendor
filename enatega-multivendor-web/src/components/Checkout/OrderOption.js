import {
  Box,
  Typography,
  useTheme,
  Dialog,
  useMediaQuery,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import useStyle from "./styles";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { useTranslation } from 'react-i18next';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


function OrderOption(props) {
  const theme = useTheme();
  const classes = useStyle();
  const {
    setIsPickUp,
    selectedDate,
    handleDateChange,
    setOrderOptionModal,
    orderOptionModal,
    isPickUp,
  } = props;
  const [timeType, setTimeType] = useState("PM");
  const { t } = useTranslation()
  const extraSmall = useMediaQuery(theme.breakpoints.down("md"));
  const [calModal, setCalModal] = useState(false);
  const [timeModal, setTimeModal] = useState(false);
  const [minutes, setMinutes] = useState(new Date().getMinutes());
  const [hours, setHours] = useState(new Date().getHours() % 12 || 12);
  const [date, setDate] = useState(selectedDate);

  const toggleCalModal = () => {
    setCalModal((prev) => !prev);
  };
  const toggleTimeModal = () => {
    setTimeModal((prev) => !prev);
  };

  return (
    <>
      <Dialog
        //fullScreen={extraSmall}
        onClose={() => setOrderOptionModal((prev) => !prev)}
        open={orderOptionModal}
        scroll="body"
        PaperProps={{
          style: {
            borderRadius: 30,
            overflowY: "visible",
            padding: theme.spacing(4),
          },
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <IconButton
            size={extraSmall ? "medium" : "small"}
            onClick={() => setOrderOptionModal((prev) => !prev)}
            className={classes.closeContainer}
          >
            <CloseIcon color="primary" />
          </IconButton>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{
            backgroundColor: theme.palette.primary.main,
            width: "240px",
            borderRadius: 20,
          }}
        >
          <Box
            onClick={() => {
              setIsPickUp(false);
            }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              backgroundColor: !isPickUp
                ? theme.palette.common.black
                : "transparent",

              padding: 10,
              borderRadius: 20,
              flexBasis: "50%",
            }}
          >
            <Typography
              variant="body1"
              style={{
                fontSize: 12,
                color: !isPickUp
                  ? theme.palette.common.white
                  : theme.palette.common.black,
              }}
              fontWeight={600}
            >
              {t('deliver')}
            </Typography>
          </Box>
          <Box
            onClick={() => {
              setIsPickUp(true);
            }}
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              backgroundColor: isPickUp
                ? theme.palette.common.black
                : "transparent",
              padding: 10,
              flexBasis: "50%",
              borderRadius: 20,
            }}
          >
            <Typography
              variant="body1"
              style={{
                fontSize: 12,
                color: isPickUp
                  ? theme.palette.common.white
                  : theme.palette.common.black,
              }}
              fontWeight={600}
            >
              {t('pickup')}
            </Typography>
          </Box>
        </Box>
        <Box className={classes.timeContainer}>
          <Typography
            variant="h4"
            style={{
              color: theme.palette.common.black,
            }}
            fontWeight={500}
          >
            {moment(selectedDate).format("HH:mm A")}
          </Typography>
          <Divider orientation="horizontal" className={classes.divider} />
          <Typography
            variant="h5"
            style={{
              color: theme.palette.grey[600],
            }}
            fontWeight={500}
          >
            {moment(selectedDate).format("DD-mm-yyyy")}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            disableElevation
            color="primary"
            className={classes.btn}
            onClick={() => {
              toggleCalModal();
              setOrderOptionModal((prev) => !prev);
            }}
          >
            <Typography
              variant="caption"
              color="black"
              style={{ textTransform: "capitalize" }}
              fontWeight={800}
            >
              {t('edit')}
            </Typography>
          </Button>
        </Box>
      </Dialog>
      <CalendarComponent
        toggleCalModal={toggleCalModal}
        calModal={calModal}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        date={date}
        setDate={setDate}
        toggleTimeModal={toggleTimeModal}
      />
      <TimeComponent
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        toggleTimeModal={toggleTimeModal}
        timeModal={timeModal}
        timeType={timeType}
        setTimeType={setTimeType}
        minutes={minutes}
        hours={hours}
        setMinutes={setMinutes}
        setHours={setHours}
        date={date}
      />
    </>
  );
}

function CalendarComponent({
  calModal,
  toggleCalModal,
  handleDateChange,
  selectedDate,
  toggleTimeModal,
  setDate,
}) {
  const theme = useTheme();
  const { t } = useTranslation()
  const extraSmall = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyle();
  return (
    <Dialog
      //fullScreen={extraSmall}
      onClose={toggleCalModal}
      open={calModal}
      scroll="body"
      PaperProps={{
        style: {
          borderRadius: extraSmall ? 10 : 30,
          overflowY: "visible",
          padding: extraSmall ? theme.spacing(1) : theme.spacing(4),
        },
      }}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          size={extraSmall ? "medium" : "small"}
          onClick={toggleCalModal}
          className={classes.closeContainer}
        >
          <CloseIcon color="primary" />
        </IconButton>
      </Box>
      <Box style={{ marginTop: 20, marginBottom: 10 }}>
        <Calendar
          onChange={(e) => {
            setDate(new Date(e).getDate())
          }}
          value={selectedDate}
          tileClassName={classes.tile}
          className={classes.cal}
        />
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          disableElevation
          color="primary"
          className={classes.btn}
          onClick={() => {
            toggleCalModal();
            toggleTimeModal();
          }}
        >
          <Typography
            variant="caption"
            color="black"
            style={{ textTransform: "capitalize" }}
            fontWeight={800}
          >
            {t('time')}
          </Typography>
        </Button>
      </Box>
    </Dialog>
  );
}

function TimeComponent({
  timeModal,
  handleDateChange,
  toggleTimeModal,
  setTimeType,
  timeType,
  minutes,
  hours,
  setMinutes,
  setHours,
  date,
}) {
  const theme = useTheme();
  const { t } = useTranslation()
  const extraSmall = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyle();
  const handleHours = (e) => {
    const regex = /^[0-9\b]+$/;
    if (
      (e.target.value.match(regex) && e.target.value <= 11) ||
      e.target.value.length < 1
    ) {
      setHours(e.target.value);
    }
  };
  const handleMinutes = (e) => {
    const regex = /^[0-9\b]+$/;
    if (
      (e.target.value.match(regex) && e.target.value <= 59) ||
      e.target.value.length < 1
    ) {
      setMinutes(e.target.value);
    }
  };

  const handleDate = (h, m) => {
    if (timeType === "PM") {
      h = parseInt(h) + 12;
    }
    const newDate = new Date(date);
    newDate.setHours(h);
    newDate.setMinutes(m);
    handleDateChange(newDate);
  };
  return (
    <Dialog
      //fullScreen={extraSmall}
      onClose={toggleTimeModal}
      open={timeModal}
      scroll="body"
      PaperProps={{
        style: {
          borderRadius: 30,
          overflowY: "visible",
          padding: extraSmall ? theme.spacing(1) : theme.spacing(4),
        },
      }}
    >
      <Box display="flex" justifyContent="flex-end">
        <IconButton
          size={extraSmall ? "medium" : "small"}
          onClick={toggleTimeModal}
          className={classes.closeContainer}
        >
          <CloseIcon color="primary" />
        </IconButton>
      </Box>
      <Typography align="center" variant="h6" color="black">
        {t('selectTime')}
      </Typography>
      <Box className={classes.timeContainer}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box className={classes.whiteBox}>
            <input
              type="text"
              className={classes.textInput}
              onChange={handleHours}
              value={hours}
            />
          </Box>
          <Typography
            variant="h4"
            style={{
              color: theme.palette.common.black,
              margin: theme.spacing(0, 2),
            }}
            fontWeight={500}
          >
            :
          </Typography>
          <Box className={classes.whiteBox}>
            <input
              type="text"
              className={classes.textInput}
              onChange={handleMinutes}
              value={minutes}
            />
          </Box>
        </Box>
      </Box>
      <Box
        style={{ marginTop: 20, marginBottom: 10 }}
        display="flex"
        justifyContent="center"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{
            backgroundColor: theme.palette.grey[300],
            width: "240px",
            borderRadius: 20,
          }}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              backgroundColor:
                timeType === "AM" ? theme.palette.primary.main : "transparent",

              padding: 10,
              borderRadius: 20,
              flexBasis: "50%",
            }}
            onClick={() => setTimeType("AM")}
          >
            <Typography
              variant="body1"
              style={{
                fontSize: 12,
                color: theme.palette.common.black,
              }}
              fontWeight={600}
            >
              {t('am')}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              backgroundColor:
                timeType === "PM" ? theme.palette.primary.main : "transparent",
              padding: 10,
              flexBasis: "50%",
              borderRadius: 20,
            }}
            onClick={() => setTimeType("PM")}
          >
            <Typography
              variant="body1"
              style={{
                fontSize: 12,
                color: theme.palette.common.black,
              }}
              fontWeight={600}
            >
              {t('pm')}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          variant="contained"
          disableElevation
          color="primary"
          className={classes.btn}
          onClick={() => {
            handleDate(hours, minutes);
            toggleTimeModal();
          }}
        >
          <Typography
            variant="caption"
            color="black"
            style={{ textTransform: "capitalize" }}
            fontWeight={800}
          >
            {t('set')}
          </Typography>
        </Button>
      </Box>
    </Dialog>
  );
}
export default React.memo(OrderOption);
