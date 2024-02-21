/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useMutation } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import clsx from "clsx";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { deleteAddress } from "../../apollo/server";
import DustbinIcon from "../../assets/icons/DustbinIcon";
import PencilIcon from "../../assets/icons/PencilIcon";
import UserContext from "../../context/User";
import FlashMessage from "../FlashMessage";
import { AddressModal } from "../Modals";
import AddressDetail from "./AddressDetail";
import useStyles from "./styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocationContext } from "../../context/Location";
import { useTranslation } from "react-i18next";
import HomeIcon from "@mui/icons-material/Home";
const LATITUDE = 33.7001019;
const LONGITUDE = 72.9735978;

const DELETE_ADDRESS = gql`
  ${deleteAddress}
`;

function DeliveryCard({
  selectedAddress,
  setSelectedAddress,
  isProfile,
  isModal,
  isCheckout,
  close,
}) {
  const { t } = useTranslation();
  const deleteId = useRef(null);
  const theme = useTheme();
  const classes = useStyles();
  const { profile } = useContext(UserContext);
  const { location } = useLocationContext();
  const [mainError, setMainError] = useState({});
  const [adressModal, setAddressModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [addressInfo, setAddressInfo] = useState(null);
  const [mutate, { loading: loadingDelete }] = useMutation(DELETE_ADDRESS, {
    onCompleted,
    onError,
  });

  useEffect(() => {
    if (location && !addressInfo) {
      currentLocation();
    }
  }, [location]);

  useEffect(() => {
    if (profile?.addresses < 1) {
      toggleShowDetail();
    } else {
      setSelectedAddress(profile?.addresses[0]);
    }
  }, [profile]);

  const currentLocation = useCallback(() => {
    if (location)
      setAddressInfo({
        lat: location?.latitude ?? LATITUDE,
        lng: location?.longitude ?? LONGITUDE,
        location: location?.deliveryAddress ?? "",
      });
  }, [location]);

  const toggleAddressModal = useCallback(() => {
    setAddressModal((prev) => !prev);
    setShowDetail((prev) => {
      if (prev) return prev;
      else return true;
    });
  }, []);

  const toggleShowDetail = useCallback(() => {
    setShowDetail((prev) => !prev);
  }, []);

  const editAddress = useCallback((item) => {
    const coordinates = {
      lat: parseFloat(item?.location.coordinates[1]) ?? null,
      lng: parseFloat(item?.location.coordinates[0]) ?? null,
    };
    setAddressInfo({
      ...coordinates,
      id: item._id,
      location: item.deliveryAddress,
      detail: item.details,
      label: item.label || "Home",
    });
    toggleShowDetail();
  }, []);

  function onCompleted() {
    setMainError({
      message: "Address Removed!",
    });
  }

  function onError(error) {
    console.log(error);
    setMainError({
      type: "error",
      message: `An error occured. Please try again. ${error}`,
    });
  }

  const toggleSnackbar = useCallback(() => {
    setTimeout(() => {
      setMainError({});
    }, 200);
  }, []);

  return (
    <Box
    // sx={{
    //   overflow: 'auto',
    //   overflowY: 'scroll',
    //   height: '100%',
    //  '-webkit-overflow-scrolling': 'touch', // For smoother scrolling on iOS
    // }}
    >
      <FlashMessage
        open={Boolean(mainError.message)}
        severity={mainError.type}
        alertMessage={mainError.message}
        handleClose={toggleSnackbar}
      />
      {isProfile ? (
        <Paper
          className={clsx(classes.root, classes.containerBox)}
          style={{ borderRadius: isCheckout ? 30 : "inherit" }}
          elevation={0}
        >
          <Container>
            {showDetail ? (
              <AddressDetail
                toggleDetail={toggleShowDetail}
                addressDetail={addressInfo}
                locationModal={toggleAddressModal}
                notification={setMainError}
              />
            ) : (
              <>
                <Grid container spacing={2}>
                  {profile?.addresses?.map((item, index) => {
                    const isSelected = item._id === selectedAddress?._id;
                    return (
                      <Grid item xs={12} lg={11} key={item._id}>
                        <Box display={"flex"}>
                          <Paper
                            onClick={() => {
                              setSelectedAddress(item);
                              setMainError({
                                type: "success",
                                message: "Address Selected",
                              });
                              close && close();
                            }}
                            className={clsx(
                              classes.width100,
                              classes.deliveryPaperProfile
                            )}
                          >
                            <Box
                              className={clsx(
                                classes.PH1,
                                classes.PB2,
                                classes.PT2,

                                {
                                  [classes.selectedDeliveryBox]: isSelected,
                                }
                              )}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box display="flex" alignItems="center">
                                <HomeIcon
                                  width={100}
                                  height={100}
                                  style={{ color: theme.palette.common.black }}
                                />
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  align="left"
                                  className={clsx(
                                    classes.smallText,
                                    classes.PH1,
                                    classes.wieght600
                                  )}
                                >
                                  {item.deliveryAddress}
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                          <Box
                            display="flex"
                            justifyContent="flex-start"
                            alignItems="center"
                            style={{ marginLeft: 10 }}
                          >
                            <Button
                              style={{ minWidth: "auto", padding: 0 }}
                              onClick={(e) => {
                                e.preventDefault();
                                editAddress(item);
                              }}
                            >
                              <ModeEditIcon
                                width={100}
                                height={100}
                                style={{ color: theme.palette.common.black }}
                              />
                            </Button>
                            <Box ml={theme.spacing(1)} />
                            <Button
                              disabled={loadingDelete}
                              style={{ minWidth: "auto", padding: 0 }}
                              onClick={(e) => {
                                e.preventDefault();
                                deleteId.current = item._id;
                                mutate({ variables: { id: item._id } });
                              }}
                            >
                              {loadingDelete &&
                              deleteId.current === item._id ? (
                                <CircularProgress size={18} color="primary" />
                              ) : (
                                <DeleteIcon
                                  style={{ color: theme.palette.common.black }}
                                />
                              )}
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
                <Box
                  style={{
                    width: "80%",
                    height: 1,
                    backgroundColor: theme.palette.common.black,
                    margin: "auto",
                    marginTop: "2rem",
                    marginBottom: "1.4rem",
                    display: isModal ? "none" : "block",
                  }}
                />
                <Box
                  display={isModal ? "none" : "flex"}
                  justifyContent="center"
                  alignItems="center"
                  pt={theme.spacing(1)}
                  pb={theme.spacing(1)}
                >
                  {!showDetail && (
                    <Button
                      variant="text"
                      className={classes.saveBtn}
                      onClick={(e) => {
                        e.preventDefault();
                        currentLocation();
                        toggleAddressModal();
                      }}
                    >
                      <Typography variant="h1" className={classes.largeText}>
                        +
                      </Typography>
                    </Button>
                  )}
                </Box>
              </>
            )}
          </Container>
        </Paper>
      ) : (
        <Paper className={clsx(classes.root, classes.containerBox)}>
          <Container>
            <Box display="flex" alignItems="center">
              <Box className={classes.redBox}>
                <Typography variant="body1">
                  <ArrowForwardIcon style={{ paddingTop: 5 }} />
                </Typography>
              </Box>
              <Box ml={theme.spacing(1)} />
              <Typography variant="h5" color="textSecondary">
                Delivery Details
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              pt={theme.spacing(1)}
              pb={theme.spacing(1)}
            >
              <Typography
                variant="body1"
                color="textSecondary"
                className={clsx(classes.boldText, classes.smallText)}
              >
                {t("deliveryAddress")}
              </Typography>
              {!showDetail && (
                <Button
                  variant="text"
                  color="primary"
                  onClick={(e) => {
                    e.preventDefault();
                    currentLocation();
                    toggleAddressModal();
                  }}
                >
                  <Typography variant="body1" className={classes.smallText}>
                    + Add address
                  </Typography>
                </Button>
              )}
            </Box>
            {showDetail ? (
              <AddressDetail
                toggleDetail={toggleShowDetail}
                addressDetail={addressInfo}
                locationModal={toggleAddressModal}
                notification={setMainError}
              />
            ) : (
              <Grid container spacing={2}>
                {profile?.addresses?.map((item, index) => {
                  const isSelected = item._id === selectedAddress?._id;
                  return (
                    <Grid item xs={12} sm={6} key={item._id}>
                      <Paper
                        onClick={() => setSelectedAddress(item)}
                        className={clsx(
                          classes.width100,
                          classes.deliveryPaper
                        )}
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
                          >
                            <Box display="flex" justifyContent="flex-end">
                              <Button
                                style={{ minWidth: "auto", padding: 0 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  editAddress(item);
                                }}
                              >
                                <PencilIcon
                                  width={100}
                                  height={100}
                                  viewBox="0 0 550 550"
                                />
                              </Button>
                              <Box ml={theme.spacing(1)} />
                              <Button
                                disabled={loadingDelete}
                                style={{ minWidth: "auto", padding: 0 }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  deleteId.current = item._id;
                                  mutate({ variables: { id: item._id } });
                                }}
                              >
                                {loadingDelete &&
                                deleteId.current === item._id ? (
                                  <CircularProgress size={18} color="primary" />
                                ) : (
                                  <DustbinIcon viewBox="0 0 90 90" />
                                )}
                              </Button>
                            </Box>
                          </Box>
                          <Box
                            justifyContent="flex-start"
                            mt={theme.spacing(1)}
                          >
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              align="left"
                              className={clsx(
                                classes.smallText,
                                classes.PH1,
                                classes.wieght300
                              )}
                            >
                              {item.deliveryAddress}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            color="textSecondary"
                            align="left"
                            className={clsx(
                              classes.PH1,
                              classes.smallText,
                              classes.disableText,
                              classes.MV1,
                              classes.wieght300
                            )}
                          >
                            {item.details}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Container>
        </Paper>
      )}

      <AddressModal
        isVisible={adressModal}
        toggleModal={toggleAddressModal}
        regionDetail={addressInfo}
        changeAddress={setAddressInfo}
        setShowDetail={setShowDetail}
      />
    </Box>
  );
}

export default React.memo(DeliveryCard);
