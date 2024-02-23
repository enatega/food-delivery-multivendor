/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Divider,
  Card as ICard,
  Typography,
  CardActionArea,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarSharpIcon from "@mui/icons-material/StarSharp";
import gql from "graphql-tag";
import React, { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addFavouriteRestaurant, profile } from "../../../apollo/server";
import ConfigurationContext from "../../../context/Configuration";
import UserContext from "../../../context/User";
import useStyles from "./styles";
import { useTranslation } from 'react-i18next';

const ADD_FAVOURITE = gql`
  ${addFavouriteRestaurant}
`;
const PROFILE = gql`
  ${profile}
`;

function PricingDelivery({
  grid,
  minimum,
  deliveryCharges,
  currencySymbol,
  isSmall,
  index,
}) {
  
  const classes = useStyles();
  const theme = useTheme();
  const containerStyle = !grid
    ? {
        display: "flex",
        alignItems: "center",
        justifyContent: isSmall ? "center" : "flex-start",
      }
    : { display: "block" };
  return (
    <Box style={containerStyle}>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className={classes.priceText}
          style={{
            color: isSmall
              ? index % 2 === 0
                ? theme.palette.primary.main
                : "#5A5858"
              : "#5A5858",
          }}
        >
          {currencySymbol} {minimum}
        </Typography>
        <Typography
          className={classes.priceDescription}
          style={{
            marginLeft: "4px",
            color: isSmall
              ? index % 2 === 0
                ? theme.palette.primary.main
                : "#5A5858"
              : "#5A5858",
          }}
        >
          Minimum
        </Typography>
      </Box>
      {grid && (
        <Divider
          light
          orientation="horizontal"
          style={{ width: "1px", height: "18px", margin: "auto 5px" }}
        />
      )}
      <Box style={{ display: "flex" }}>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className={classes.priceText}
        >
          {deliveryCharges > 0 ? `${currencySymbol} ${deliveryCharges}` : ``}
        </Typography>
        <Typography
          variant="caption"
          style={{ marginLeft: "4px" }}
          className={classes.priceDescription}
        >
          {deliveryCharges > 0 ? "delivery fee" : ""}
        </Typography>
      </Box>
    </Box>
  );
}
function Card(props) {
  const { t } = useTranslation();
  const item = props.data ?? null;
  const navigateTo = useNavigate();
  const { profile } = useContext(UserContext);
  const theme = useTheme();
  const grid = props.grid ? props.grid : false;
  const heart = profile ? profile.favourite.includes(item?._id) : false;
  const cardImageHeight = props.cardImageHeight
    ? props.cardImageHeight
    : "144px";
  const category = item.categories.map((category) => category.title);
  const configuration = useContext(ConfigurationContext);
  const classes = useStyles(props);
  const [mutate, { loading }] = useMutation(ADD_FAVOURITE, {
    onCompleted,
    refetchQueries: [{ query: PROFILE }],
  });

  function onCompleted() {
    props.showMessage({
      type: "success",
      message: t('favouriteListUpdated'),
    });
  }

  const navigate = useCallback(() => {
    if (
      props.checkCart(item._id, item.name, item.image, item.slug) &&
      !loading
    ) {
      navigateTo(`/restaurant/${item.slug}`, {
        state: {
          id: item._id,
          name: item.name,
          image: item.image,
          slug: item.slug,
        },
      });
    }
  }, [navigateTo, item._id]);

  return (
    <ICard
      className={classes.card}
      style={{
        backgroundColor: props.isSmall
          ? props.index % 2 === 0
            ? "black"
            : theme.palette.primary.main
          : "white",
      }}
    >
      <CardActionArea
        onClick={(e) => {
          e.preventDefault();
          navigate();
        }}
      >
        <Box
          className={props.isSmall ? classes.smallWidth : classes.largeWidth}
        >
          <Box
            style={{
              height: cardImageHeight,
            }}
            className={classes.imageContainer}
          >
            <Box
              style={{
                height: cardImageHeight,
                backgroundImage: `url("${item.image}")`,
              }}
              className={classes.imgContainer}
            />
            <Box className={classes.timeContainer}>
              <Typography
                color="textSecondary"
                className={classes.timeText}
                style={{ fontSize: ".75rem" }}
              >
                {item.deliveryTime}
              </Typography>
              <Typography color="textSecondary" className={classes.timeText}>
                {" "}
                MIN
              </Typography>
            </Box>
            <Box
              onMouseDown={(e) => e.stopPropagation()}
              size="small"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!profile) {
                  props.showMessage({
                    type: "error",
                    message: "You are not logged in.",
                  });
                }
                if (!loading && profile) {
                  mutate({ variables: { id: item._id } });
                }
              }}
              className={
                props.isSmall ? classes.smallHeartBtn : classes.heartBtn
              }
            >
              {loading ? (
                <CircularProgress size={15} />
              ) : heart ? (
                <FavoriteIcon fontSize="small" className={classes.icon} />
              ) : (
                <FavoriteBorderIcon fontSize="small" className={classes.icon} />
              )}
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            className={classes.row}
            flexDirection={props.isSmall ? "column" : "row"}
          >
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className={classes.textBold}
              noWrap
              align={props.isSmall ? "center" : "left"}
              style={{
                color: props.isSmall
                  ? props.index % 2 === 0
                    ? theme.palette.primary.main
                    : "black"
                  : "black",
              }}
            >
              {item.name}
            </Typography>
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: props.isSmall ? "center" : "flex-end",
              }}
            >
              <StarSharpIcon style={{ fontSize: "16px", color: "#448B7B" }} />
              <Typography
                variant="caption"
                color="textSecondary"
                className={`${classes.textBold} ${classes.totalRatingText}`}
                style={{
                  color: props.isSmall
                    ? props.index % 2 === 0
                      ? "white"
                      : "#5A5858"
                    : "#5A5858",
                }}
              >
                {item.reviewData.ratings}
              </Typography>
              <Typography
                variant="caption"
                className={classes.totalRatingText}
                style={{
                  color: props.isSmall
                    ? props.index % 2 === 0
                      ? "white"
                      : "#5A5858"
                    : "#5A5858",
                }}
              >
                /5
              </Typography>
              <Typography
                variant="caption"
                className={classes.totalRatingText}
                style={{
                  color: props.isSmall
                    ? props.index % 2 === 0
                      ? "white"
                      : "#5A5858"
                    : "#5A5858",
                  fontSize: "0.875rem",
                  marginLeft: "3px",
                }}
              >
                ({item.reviewData.reviews.length})
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            className={classes.row}
            flexDirection={props.isSmall ? "column" : "row"}
          >
            <Typography
              display="inline"
              noWrap
              variant="caption"
              className={classes.subDescription}
              align={props.isSmall ? "center" : "left"}
              style={{
                color: props.isSmall
                  ? props.index % 2 === 0
                    ? theme.palette.primary.main
                    : "#5A5858"
                  : "#5A5858",
              }}
            >
              {category.toString()}
            </Typography>
            <PricingDelivery
              minimum={item.minimumOrder ?? 0}
              deliveryCharges={item.deliveryCharges ?? 0}
              grid={grid}
              currencySymbol={configuration.currencySymbol}
              isSmall={props.isSmall}
              index={props.index}
            />
          </Box>
        </Box>
      </CardActionArea>
    </ICard>
  );
}

export default React.memo(Card);
