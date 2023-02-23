/* eslint-disable react-hooks/exhaustive-deps */
import { useMutation } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Divider,
  Card as ICard,
  Typography,
  CardActionArea,
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

const ADD_FAVOURITE = gql`
  ${addFavouriteRestaurant}
`;
const PROFILE = gql`
  ${profile}
`;

function PricingDelivery({ grid, minimum, deliveryCharges, currencySymbol }) {
  const classes = useStyles();
  const containerStyle = grid
    ? { display: "flex", alignItems: "center" }
    : { display: "block" };
  return (
    <Box style={containerStyle}>
      <Box style={{ display: "flex" }}>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          className={classes.priceText}
        >
          {currencySymbol} {minimum}
        </Typography>
        <Typography
          style={{ marginLeft: "4px" }}
          className={classes.priceDescription}
        >
          minumum
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
  const item = props.data ?? null;
  const navigateTo = useNavigate();
  const { profile } = useContext(UserContext);
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
      message: "Favourite list updated.",
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
    <ICard className={classes.card}>
      <CardActionArea
        onClick={(e) => {
          e.preventDefault();
          navigate();
        }}
      >
        <Box style={{ minWidth: "200px" }}>
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
              className={classes.heartBtn}
            >
              {loading ? (
                <CircularProgress size={15} />
              ) : heart ? (
                <FavoriteIcon fontSize="small" color="primary" />
              ) : (
                <FavoriteBorderIcon fontSize="small" color="primary" />
              )}
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className={classes.textBold}
            >
              {item.name}
            </Typography>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <StarSharpIcon style={{ fontSize: "14px", color: "#276fa5" }} />
              <Typography
                variant="caption"
                color="textSecondary"
                className={classes.textBold}
              >
                {item.reviewData.ratings}
              </Typography>
              <Typography variant="caption" className={classes.totalRatingText}>
                /5
              </Typography>
              <Typography
                variant="caption"
                style={{ fontSize: "0.875rem", marginLeft: "3px" }}
                className={classes.totalRatingText}
              >
                ({item.reviewData.reviews.length})
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography
              display="inline"
              noWrap
              variant="caption"
              className={classes.subDescription}
            >
              {category.toString()}
            </Typography>
          </Box>
          <PricingDelivery
            minimum={item.minimumOrder ?? 0}
            deliveryCharges={item.deliveryCharges ?? 0}
            grid={grid}
            currencySymbol={configuration.currencySymbol}
          />
        </Box>
      </CardActionArea>
    </ICard>
  );
}

export default React.memo(Card);
