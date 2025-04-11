/* eslint-disable @typescript-eslint/no-require-imports */
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, {
  LatLng,
  MapStyleElement,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Easing } from "react-native-reanimated";

// Methods
import { linkToMapsApp } from "@/lib/utils/methods";

// Icons
import Icons from "@expo/vector-icons/MaterialIcons";

// Screen Components
import ItemDetails from "@/lib/ui/screen-components/home/orders/main/item-details";

// Hooks
import useDetails from "@/lib/hooks/useDetail";
import useOrderDetail from "@/lib/hooks/useOrderDetails";

// Context
import { ConfigurationContext } from "@/lib/context/global/configuration.context";

// UI Components
import { RIDER_ORDERS } from "@/lib/apollo/queries";
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { CustomContinueButton } from "@/lib/ui/useable-components";
import AccordionItem from "@/lib/ui/useable-components/accordian";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import { HomeIcon } from "@/lib/ui/useable-components/svg";
import WelldoneComponent from "@/lib/ui/useable-components/well-done";
import { CustomMapStyles } from "@/lib/utils/constants/map";
import { map_styles } from "@/lib/utils/constants/order-details";
import { IOrder } from "@/lib/utils/interfaces/order.interface";

const { height } = Dimensions.get("window");

// Helper function to check if coordinates are valid
// Added to prevent array bounds crashes when using invalid coordinates
const isValidCoordinate = (coord?: LatLng): boolean => {
  if (!coord) return false;
  return (
    coord.latitude !== undefined &&
    coord.longitude !== undefined &&
    !isNaN(coord.latitude) &&
    !isNaN(coord.longitude) &&
    Math.abs(coord.latitude) <= 90 &&
    Math.abs(coord.longitude) <= 180
  );
};

export default function OrderDetailScreen() {
  // Ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Context
  const configuration = useContext(ConfigurationContext);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Hooks
  const { appTheme, currentTheme } = useApptheme();
  const { t } = useTranslation();
  const {
    restaurantAddressPin,
    deliveryAddressPin,
    GOOGLE_MAPS_KEY,
    setDistance,
    setDuration,
    order,
    tab,
    locationPin,
  } = useOrderDetail();
  const { userId } = useUserContext();
  const [localOrder, setLocalOrder] = useState<IOrder>({} as IOrder);
  const { mutateAssignOrder, mutateOrderStatus, loadingOrderStatus } =
    useDetails(order);

  // States
  const [customMapStyles, setCustomMapStyles] = useState<MapStyleElement[]>();
  const [orderId, setOrderId] = useState("");
  const [retryCount, setRetryCount] = useState(0); // Added to implement retry logic

  // Ref
  const latitude = useRef(
    new Animated.Value(locationPin.location.latitude),
  ).current;
  const longitude = useRef(
    new Animated.Value(locationPin.location.longitude),
  ).current;
  const waveAnimation = useRef(new Animated.Value(0)).current; // Wave animation value

  // Handler
  const moveMarker = (newLocation: LatLng) => {
    // Safety check for valid coordinates before starting animation
    // This prevents trying to animate to invalid coordinates which could cause crashes
    if (!isValidCoordinate(newLocation)) {
      console.warn("Attempted to move marker to invalid location", newLocation);
      return;
    }

    // Use a single animation group to prevent potential race conditions
    // This prevents array index issues by ensuring animations stay in sync
    Animated.parallel([
      Animated.timing(latitude, {
        toValue: newLocation.latitude,
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(longitude, {
        toValue: newLocation.longitude,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    return () => {
      // Clean up any pending retry timeouts
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []);

  const openMaps = () => {
    try {
      // Validate all required coordinates to prevent app crashes
      // when trying to construct navigation URLs with invalid data
      if (!isValidCoordinate(locationPin?.location)) {
        console.log("Invalid rider location for maps navigation");
        Alert.alert(t("Navigation Error"), t("Rider location is unavailable."));
        return;
      }

      if (!isValidCoordinate(restaurantAddressPin?.location)) {
        console.log("Invalid store location for maps navigation");
        Alert.alert(
          t("Navigation Error"),
          t("Restaurant location is unavailable."),
        );
        return;
      }

      if (!isValidCoordinate(deliveryAddressPin?.location)) {
        console.log("Invalid customer location for maps navigation");
        Alert.alert(
          t("Navigation Error"),
          t("Delivery location is unavailable."),
        );
        return;
      }

      const rider = `${locationPin.location.latitude},${locationPin.location.longitude}`;
      const store = `${restaurantAddressPin.location.latitude},${restaurantAddressPin.location.longitude}`;
      const customer = `${deliveryAddressPin.location.latitude},${deliveryAddressPin.location.longitude}`;

      if (Platform.OS === "ios") {
        // Apple Maps (Only Rider -> Store -> Customer)
        const appleMapsUrl = `maps://app?saddr=${rider}&daddr=${localOrder?.orderStatus === "PICKED" ? customer : store}`;
        // Added error handling for Linking
        Linking.openURL(appleMapsUrl).catch(() => {
          Alert.alert(
            t("Navigation Error"),
            t("Could not open maps application"),
          );
        });
      } else {
        // Google Maps (Supports waypoints: Rider -> Store -> Customer)
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${rider}&destination=${customer}&waypoints=${store}`;
        // Added error handling for Linking
        Linking.openURL(googleMapsUrl).catch(() => {
          Alert.alert(
            t("Navigation Error"),
            t("Could not open maps application"),
          );
        });
      }
    } catch (error) {
      // Added global error handling
      console.log("Error opening maps:", error);
      Alert.alert(
        t("Navigation Error"),
        t("An error occurred when trying to open maps"),
      );
    }
  };

  // Use Effect
  useEffect(() => {
    const styles_for_map = CustomMapStyles(appTheme);
    if (currentTheme && appTheme) {
      setCustomMapStyles(styles_for_map);
    }

    // Added validation for Google Maps API key to catch common configuration issues
    if (!GOOGLE_MAPS_KEY || GOOGLE_MAPS_KEY === "") {
      console.log("Google Maps API key is missing or invalid");
    }
  }, [appTheme, currentTheme, GOOGLE_MAPS_KEY]);

  useEffect(() => {
    // Only set up the animation if locationPin.location exists and is valid
    // This prevents trying to animate when location data is invalid
    if (!locationPin?.location || !isValidCoordinate(locationPin.location)) {
      console.warn("Location pin is invalid or missing:", locationPin);
      return;
    }

    // Reference to the timer for proper cleanup
    let intervalId: NodeJS.Timeout | null = null;

    try {
      // Safely initialize marker position before starting animations
      // This prevents issues with undefined initial values
      const initialLatitude = locationPin.location.latitude;
      const initialLongitude = locationPin.location.longitude;

      // Initial positioning (without animation)
      latitude.setValue(initialLatitude);
      longitude.setValue(initialLongitude);

      // Start periodic updates with proper error handling
      intervalId = setInterval(() => {
        if (
          !locationPin?.location ||
          !isValidCoordinate(locationPin.location)
        ) {
          console.warn("Skipping marker update due to invalid location data");
          return;
        }

        const newLatitude = locationPin.location.latitude;
        const newLongitude = locationPin.location.longitude;
        moveMarker({ latitude: newLatitude, longitude: newLongitude });
      }, 5000);

      // Start wave animation
      const animation = Animated.loop(
        Animated.timing(waveAnimation, {
          toValue: 1000,
          duration: 10000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      );

      animation.start();

      return () => {
        // Proper cleanup to prevent animation continuing after unmount
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        animation.stop();
      };
    } catch (error) {
      // Error handling to prevent uncaught exceptions
      console.log("Error in location animation setup:", error);
      if (intervalId) {
        clearInterval(intervalId);
      }
      return () => {};
    }
    // Added proper dependency array to control rerunning this effect
    // This prevents stale closures that might reference outdated data
  }, [locationPin?.location?.latitude, locationPin?.location?.longitude]);

  useEffect(() => {
    if (order) {
      setLocalOrder(order);
    }
  }, [order]);

  if (!localOrder) return;

  return (
    <>
      <GestureHandlerRootView
        className="flex-1"
        style={{ backgroundColor: appTheme.themeBackground, height: "100%" }}
      >
        <View
          style={{
            height: height * 0.5,
            backgroundColor: "transparent",
          }}
        >
          {/* <Button title="Open in Maps" onPress={openMaps} /> */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",

              width: 38,
              backgroundColor: appTheme.themeBackground,
              opacity: 0.75,
              position: "absolute",
              top: 60,
              right: 12,
              zIndex: 1,
            }}
          >
            <TouchableOpacity onPress={openMaps}>
              <Icons
                name="navigation"
                size={30}
                color="#1f2937"
                className={appTheme.fontMainColor}
              />
            </TouchableOpacity>
          </View>
          {locationPin && GOOGLE_MAPS_KEY ? (
            <MapView
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: appTheme.themeBackground,
              }}
              customMapStyle={customMapStyles}
              showsUserLocation
              zoomEnabled={true}
              zoomControlEnabled={true}
              rotateEnabled={false}
              initialRegion={{
                latitude: locationPin?.location?.latitude ?? 0.0,
                longitude: locationPin?.location?.longitude ?? 0.0,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              provider={PROVIDER_GOOGLE}
              // customMapStyle={MapStyles}
            >
              {deliveryAddressPin?.location && (
                <Marker
                  coordinate={deliveryAddressPin.location}
                  title={t("Delivery Address")}
                  onPress={() => {
                    linkToMapsApp(
                      deliveryAddressPin.location,
                      deliveryAddressPin.label,
                    );
                  }}
                >
                  <Image
                    source={require("@/lib/assets/home_icon.png")}
                    style={{ height: 35, width: 32 }}
                  />
                </Marker>
              )}
              {restaurantAddressPin?.location && (
                <Marker
                  coordinate={restaurantAddressPin.location}
                  title={t("Restaurant")}
                  onPress={() => {
                    linkToMapsApp(
                      restaurantAddressPin.location,
                      restaurantAddressPin.label,
                    );
                  }}
                >
                  <Image
                    source={require("@/lib/assets/rest_icon.png")}
                    style={{ height: 35, width: 32 }}
                  />
                </Marker>
              )}
              {/* Added multiple validation checks for rider marker to prevent array index errors */}
              {locationPin?.location &&
                isValidCoordinate(locationPin.location) && (
                  <Marker.Animated
                    coordinate={{ latitude, longitude }}
                    title="Rider"
                    description={t("This is rider's location")}
                    onPress={() => {
                      if (
                        locationPin?.location &&
                        isValidCoordinate(locationPin.location)
                      ) {
                        linkToMapsApp(locationPin.location, locationPin.label);
                      }
                    }}
                  >
                    <Image
                      source={require("@/lib/assets/rider_icon.png")}
                      style={{ height: 35, width: 32 }}
                    />
                  </Marker.Animated>
                )}

              {/* Added validation for rider to restaurant directions */}
              {localOrder?.orderStatus === "ACCEPTED" ||
              localOrder?.orderStatus === "ASSIGNED"
                ? isValidCoordinate(locationPin?.location) &&
                  isValidCoordinate(restaurantAddressPin?.location) &&
                  GOOGLE_MAPS_KEY && (
                    <MapViewDirections
                      origin={locationPin?.location}
                      destination={restaurantAddressPin?.location}
                      apikey={GOOGLE_MAPS_KEY}
                      strokeWidth={2}
                      strokeColor={"#f95509"}
                      precision="low"
                      resetOnChange={false} // Prevents unnecessary recalculations
                      onReady={(results) => {
                        if (results && results.distance) {
                          setDistance(results.distance);
                          setDuration(results.duration);
                        }
                      }}
                      optimizeWaypoints={true}
                      onError={(error) => {
                        console.log("Detailed route error:", error);
                        // Retry logic for NOT_FOUND errors
                        if (
                          error.toString().includes("NOT_FOUND") &&
                          retryCount < 10
                        ) {
                          setRetryCount((prev) => prev + 1);
                        }
                      }}
                    />
                  )
                : null}

              {/* Added validation for rider to customer directions */}
              {localOrder?.orderStatus === "PICKED" &&
                isValidCoordinate(locationPin?.location) &&
                isValidCoordinate(deliveryAddressPin?.location) &&
                GOOGLE_MAPS_KEY && (
                  <MapViewDirections
                    origin={locationPin?.location}
                    destination={deliveryAddressPin?.location}
                    apikey={GOOGLE_MAPS_KEY}
                    strokeWidth={2}
                    strokeColor={"#f95509"}
                    precision="low"
                    resetOnChange={false}
                    optimizeWaypoints={true}
                    onReady={(result) => {
                      setDistance(result.distance);
                      setDuration(result.duration);
                    }}
                    onError={(error) => {
                      console.log("Delivery route error:", error);
                      // Retry logic for NOT_FOUND errors
                      if (
                        error.toString().includes("NOT_FOUND") &&
                        retryCount < 10
                      ) {
                        setRetryCount((prev) => prev + 1);
                      }
                    }}
                  />
                )}

              {/* Added validation for restaurant to customer directions */}
              {localOrder?.orderStatus !== "ACCEPTED" &&
                localOrder?.orderStatus !== "PICKED" &&
                localOrder?.orderStatus !== "ASSIGNED" &&
                isValidCoordinate(restaurantAddressPin?.location) &&
                isValidCoordinate(deliveryAddressPin?.location) && (
                  <MapViewDirections
                    origin={restaurantAddressPin?.location}
                    destination={deliveryAddressPin?.location}
                    apikey={GOOGLE_MAPS_KEY ?? ""}
                    strokeWidth={2}
                    precision="low"
                    strokeColor={"#f95509"}
                    resetOnChange={false}
                    optimizeWaypoints={true}
                    onReady={(result) => {
                      if (result) {
                        setDistance(result.distance);
                        setDuration(result.duration);
                      }
                    }}
                    onError={(error) => {
                      console.log("Default route error:", error);
                      // Retry logic for NOT_FOUND errors
                      if (
                        error.toString().includes("NOT_FOUND") &&
                        retryCount < 10
                      ) {
                        setRetryCount((prev) => prev + 1);
                      }
                    }}
                  />
                )}
              {/* <Button title="Open in Maps" onPress={openMaps} /> */}
            </MapView>
          ) : (
            <View className="flex-1 justify-center items-center gap-y-3">
              <Text className="text-3xl">{t("Map not loaded.")}</Text>
              <Text
                className="text-lg "
                style={{ color: appTheme.fontSecondColor }}
              >
                {t("Please check for permissions.")}
              </Text>
            </View>
          )}
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={0} // Initially, the sheet starts at 50% height (snap point 0)
          snapPoints={["50%"]} // Snap points: 50%
          backgroundStyle={map_styles.backgroundStyle} // Optional, to style the background
          animateOnMount={true} // Ensure that the initial animation is applied
          handleIndicatorStyle={{
            backgroundColor: "transparent",
          }}
          enableDynamicSizing
          enableOverDrag={false}
          maxDynamicContentSize={height * 0.8} // Set a maximum dynamic content size (optional)
        >
          <BottomSheetView
            className="flex-1  border p-1.5 rounded-lg"
            style={{
              backgroundColor: appTheme.themeBackground,
              borderColor: appTheme.borderLineColor,
            }}
          >
            <BottomSheetScrollView
              className="p-2"
              showsVerticalScrollIndicator={false}
              style={{ backgroundColor: appTheme.themeBackground }}
            >
              {/* Order ID */}
              <View className="flex-row justify-between mb-4">
                <Text
                  className="font-bold "
                  style={{ color: appTheme.fontSecondColor }}
                >
                  {t("Order ID")}
                </Text>
                <Text style={{ color: appTheme.fontMainColor }}>
                  #{localOrder?.orderId ?? "-"}
                </Text>
              </View>

              <View className="flex-1 flex-row justify-start items-center gap-x-4 mb-4">
                <Image
                  src={localOrder?.restaurant?.image}
                  style={{ width: 32, height: 30, borderRadius: 8 }}
                />

                {localOrder?.restaurant?.name && (
                  <Text
                    className="font-[Inter] text-lg font-bold leading-7 text-left underline-offset-auto decoration-skip-ink "
                    style={{ color: appTheme.fontMainColor }}
                  >
                    {localOrder?.restaurant?.name}
                  </Text>
                )}
              </View>

              {/* Pick Up Order */}
              <View className="w-[90%] flex-row items-center gap-x-2 mb-4">
                <View>
                  <HomeIcon
                    width={30}
                    height={30}
                    color={appTheme.fontMainColor}
                  />
                </View>
                <View>
                  <Text
                    className="font-[Inter] text-base font-semibold leading-6 text-left underline-offset-auto decoration-skip-ink "
                    style={{ color: appTheme.fontSecondColor }}
                  >
                    {t("Pickup Order")}
                  </Text>
                  <Text
                    className="font-[Inter] text-base font-bold leading-6 text-left underline-offset-auto decoration-skip-ink "
                    style={{ color: appTheme.fontMainColor }}
                  >
                    {localOrder?.restaurant?.address ?? "-"}
                  </Text>
                </View>
              </View>

              {/* Payment Method */}
              <View className="flex-1 flex-row justify-between items-center mb-4">
                <Text
                  className="font-[Inter] text-[16px] text-base font-[500]"
                  style={{ color: appTheme.fontSecondColor }}
                >
                  {t("Payment Method")}
                </Text>
                <Text
                  className="font-[Inter] text-base font-semibold  text-left underline-offset-auto decoration-skip-ink   mr-2"
                  style={{ color: appTheme.fontMainColor }}
                >
                  {localOrder?.paymentMethod}
                </Text>
              </View>

              {/* Order Amount */}
              <View className="w-[99%] flex-row justify-between">
                <Text
                  className="flex-1 font-[Inter] text-[16px] text-base font-[500] "
                  style={{ color: appTheme.fontSecondColor }}
                >
                  {t("Order Amount")}
                </Text>

                <Text
                  className="flex-1 font-[Inter] font-semibold text-right "
                  style={{ color: appTheme.fontMainColor }}
                >
                  {configuration?.currencySymbol}
                  {localOrder?.orderAmount}
                  {localOrder.paymentStatus === "PAID"
                    ? t("Paid")
                    : t("(Not paid yet)")}
                </Text>
              </View>

              {/* Divider */}
              <View className="flex-1 h-[1px] mb-4" />

              <AccordionItem title={t("Order Details")}>
                <ItemDetails orderData={localOrder} tab={tab} />
              </AccordionItem>

              {/* Pick up Button */}
              {tab === "processing" &&
                localOrder.orderStatus === "ASSIGNED" && (
                  <TouchableOpacity
                    className="h-14 rounded-3xl py-3 w-full mt-4 mb-10"
                    style={{ backgroundColor: appTheme.primary }}
                    disabled={loadingOrderStatus}
                    onPress={() =>
                      mutateOrderStatus({
                        variables: { id: localOrder?._id, status: "PICKED" },
                      })
                    }
                  >
                    {loadingOrderStatus ? (
                      <SpinnerComponent />
                    ) : (
                      <Text
                        className="text-center  text-lg font-medium"
                        style={{ color: appTheme.black }}
                      >
                        {t("Pick up")}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}

              {tab == "processing" && localOrder.orderStatus === "PICKED" && (
                <TouchableOpacity
                  className="h-14 rounded-3xl py-3 w-full mt-4 mb-10"
                  style={{ backgroundColor: appTheme.primary }}
                  disabled={loadingOrderStatus}
                  onPress={async () => {
                    await mutateOrderStatus({
                      variables: { id: localOrder?._id, status: "DELIVERED" },
                      onCompleted: () => {
                        setOrderId(localOrder?.orderId);
                      },
                    });
                    setOrderId(localOrder?.orderId);
                  }}
                >
                  {loadingOrderStatus ? (
                    <SpinnerComponent color="white" />
                  ) : (
                    <Text
                      className="text-center text-lg font-medium"
                      style={{ color: appTheme.black }}
                    >
                      {t("Mark as Delivered")}
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {tab === "new_orders" &&
                localOrder.orderStatus === "ACCEPTED" && (
                  <CustomContinueButton
                    title={t("Assign me")}
                    className="w-[55%] mx-auto"
                    onPress={() =>
                      mutateAssignOrder({
                        variables: { id: localOrder?._id },
                        refetchQueries: [
                          {
                            query: RIDER_ORDERS,
                            variables: { userId: userId },
                          },
                        ],
                      })
                    }
                  />
                )}
            </BottomSheetScrollView>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
      {
        <WelldoneComponent
          orderId={orderId}
          setOrderId={setOrderId}
          status={localOrder?.orderStatus === "DELIVERED" ? "Delivered" : ""}
        />
      }
    </>
  );
}
