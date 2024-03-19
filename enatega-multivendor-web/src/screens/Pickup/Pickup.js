/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useLazyQuery } from "@apollo/client";
import { Box, CircularProgress, Grid, Typography, Button } from "@mui/material";
import React, {
   useCallback,
   useContext,
   useEffect,
   useState,
   useRef,
} from "react";
import { useNavigate } from "react-router";
import { restaurantList } from "../../apollo/server";
import FlashMessage from "../../components/FlashMessage";
import Footer from "../../components/Footer/Footer";
import { Header, LoginHeader } from "../../components/Header";
import { ClearCart } from "../../components/Modals";
import RestaurantGridForPickup from "../../components/RestaurantComponent/RestaurantGridForPickup/RestaurantGridForPickup";
import Subheader from "../../components/RestaurantComponent/Subheader/Subheader";
import { LocationContext } from "../../context/Location";
import UserContext from "../../context/User";
import useStyles from "./styles";
import { GoogleMap, Marker } from "@react-google-maps/api";
import MarkerImage from "../../assets/images/marker.png";

const RESTAURANTS = gql`
   ${restaurantList}
`;

function Pickup() {
   const navigate = useNavigate();
   const { location } = useContext(LocationContext);
   const [center, setCenter] = useState({
      lat: 0,
      lng: 0,
   });
   const [message, setMessage] = useState({});
   const { isLoggedIn } = useContext(UserContext);
   const [clearModal, setClearModal] = useState(false);
   const [navigateData, setNavigateData] = useState({});
   const classes = useStyles();
   const { clearCart, restaurant: cartRestaurant } = useContext(UserContext);
   const mapRef = useRef(null);
   const fetchRef = useRef(false);
   const [loader, setLoader] = useState(true);

   const [fetchRestaurants, { data, loading, error, refetch }] = useLazyQuery(
      RESTAURANTS,
      {
         fetchPolicy: "network-only",
         onCompleted,
      }
   );
   function onCompleted(data) {
      setLoader(false);
   }
   const navigateClearCart = useCallback(async () => {
      await clearCart();
      navigate(`/restaurant/${navigateData.slug}`, { state: navigateData });
   }, [navigateData]);

   const checkCart = useCallback(
      (id, name, image, slug) => {
         if (cartRestaurant && id !== cartRestaurant) {
            setNavigateData({ id, name, image, slug });
            toggleClearCart();
            return false;
         }
         return true;
      },
      [cartRestaurant]
   );

   const toggleClearCart = useCallback(() => {
      setClearModal((prev) => !prev);
   }, []);

   useEffect(() => {
      if (!fetchRef.current) return;
      (async () => {
         const cen = {
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude),
         };
         const variables = {
            longitude: parseFloat(location.longitude) || null,
            latitude: parseFloat(location.latitude) || null,
         };
         await refetch(variables);
         setCenter(cen);
      })();
   }, [location]);

   useEffect(() => {
      if (!location) return;
      if (fetchRef.current) return;
      const cen = {
         lat: parseFloat(location.latitude),
         lng: parseFloat(location.longitude),
      };
      const variables = {
         longitude: parseFloat(location.longitude) || null,
         latitude: parseFloat(location.latitude) || null,
      };
      fetchRestaurants({ variables });
      setCenter(cen);
      fetchRef.current = true;
   }, [location]);

   const showMessage = useCallback((messageObj) => {
      setMessage(messageObj);
   }, []);
   const toggleSnackbar = useCallback(() => {
      setMessage({});
   }, []);

   if (loader || loading || error) {
      return (
         <Grid container className={classes.marginHeader}>
            {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
            <Subheader />
            <Box className={classes.spinnerContainer}>
               {loading ? (
                  <CircularProgress color="primary" size={48} />
               ) : (
                  <Typography>Unable to load data </Typography>
               )}
            </Box>
         </Grid>
      );
   }
   const { restaurants } = data?.nearByRestaurants ?? {};

   const containerStyle = {
      width: "100%",
      height: "700px",
      marginTop: "-50px",
   };

   function handleLoad(map) {
      mapRef.current = map;
   }

   const searchArea = async () => {
      const cen = {
         lat: parseFloat(mapRef.current.getCenter().toJSON().lat),
         lng: parseFloat(mapRef.current.getCenter().toJSON().lng),
      };
      const variables = {
         longitude: parseFloat(cen.lng) || null,
         latitude: parseFloat(cen.lat) || null,
      };
      setCenter(cen);
      await refetch(variables);
   };

   const onClickMarker = item => {
      const element = document.querySelector(
         `[id="${item._id}"]`
      );
      element.scrollIntoView({
         behavior: "smooth",
         block: "center",
      });

      element.focus({ preventScroll: true });
   }

   return (
      <Grid container>
         <FlashMessage
            open={Boolean(message.type)}
            severity={message.type}
            alertMessage={message.message}
            handleClose={toggleSnackbar}
         />
         {isLoggedIn ? <Header /> : <LoginHeader showIcon />}
         <Subheader />

         <Grid
            container
            spacing={0}
            className={[classes.marginHeader, classes.rowReverse]}
         >
            <Grid className={classes.marginHeader} item md={9} xs={12}>
               <Button className={classes.btn} onClick={() => searchArea()}>
                  Search area
               </Button>
               <GoogleMap
                  onLoad={handleLoad}
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={10}
                  options={{
                     fullscreenControl: false,
                     streetViewControl: false,
                     MapTypeControlOptions: false,
                     mapTypeControl: false,
                  }}
               >
                  <Marker
                     position={{
                        lat: parseFloat(location.latitude),
                        lng: parseFloat(location.longitude),
                     }}
                     icon={MarkerImage}
                     title={location.deliveryAddress}
                  />
                  {restaurants?.map((item) => {
                     return (
                        <Marker
                           key={item._id}
                           position={{
                              lat: parseFloat(item.location.coordinates[1]),
                              lng: parseFloat(item.location.coordinates[0]),
                           }}
                           onClick={()=>onClickMarker(item)}
                           title={item.name}
                        />
                     );
                  })}
               </GoogleMap>
            </Grid>
            <Grid className={classes.restaurants} item md={3} xs={12}>
               <RestaurantGridForPickup
                  checkCart={checkCart}
                  restaurants={restaurants}
                  showMessage={showMessage}
               />
            </Grid>
         </Grid>
         <Footer />
         <ClearCart
            isVisible={clearModal}
            toggleModal={toggleClearCart}
            action={navigateClearCart}
         />
      </Grid>
   );
}

export default Pickup;
